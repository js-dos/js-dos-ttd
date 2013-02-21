/* $Id: address.cpp 23193 2011-11-12 08:10:22Z rubidium $ */

/*
 * This file is part of OpenTTD.
 * OpenTTD is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, version 2.
 * OpenTTD is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with OpenTTD. If not, see <http://www.gnu.org/licenses/>.
 */

/** @file core/address.cpp Implementation of the address. */

#include "../../stdafx.h"

#include <sys/types.h>
#ifdef ENABLE_NETWORK

#include "address.h"
#include "../../debug.h"

#include <emscripten.h>

#define NI_NUMERICHOST	1	/* Don't try to look up hostname.  */
#define AI_ADDRCONFIG	0x0020	/* Use configuration of this host to choose
				   returned address type..  */
#define AI_PASSIVE	0x0001	/* Socket address is intended for `bind'.  */
#define IPPROTO_IPV6 	41
#define IPV6_V6ONLY	25
#define IFF_BROADCAST	0x2

extern "C" {
	int getnameinfo(const struct sockaddr *sa, socklen_t salen,
                char *host, size_t hostlen,
                char *serv, size_t servlen, int flags);

	int getaddrinfo(const char *node, const char *service,
	                const struct addrinfo *hints,
	                struct addrinfo **res);

	void freeaddrinfo(struct addrinfo *res);

	const char *gai_strerror(int errcode);
}

static SOCKET ConnectLoopProc(addrinfo *runp);


/**
 * Get the hostname; in case it wasn't given the
 * IPv4 dotted representation is given.
 * @return the hostname
 */
const char *NetworkAddress::GetHostname()
{
	if (StrEmpty(this->hostname) && this->address.ss_family != AF_UNSPEC) {
		assert(this->address_length != 0);
		getnameinfo((struct sockaddr *)&this->address, this->address_length, this->hostname, sizeof(this->hostname), NULL, 0, NI_NUMERICHOST);
	}
	return this->hostname;
}

/**
 * Get the port.
 * @return the port.
 */
uint16 NetworkAddress::GetPort() const
{
	switch (this->address.ss_family) {
		case AF_UNSPEC:
		case AF_INET:
			return ntohs(((const struct sockaddr_in *)&this->address)->sin_port);

		case AF_INET6:
			return ntohs(((const struct sockaddr_in6 *)&this->address)->sin6_port);

		default:
			NOT_REACHED();
	}
}

/**
 * Set the port.
 * @param port set the port number.
 */
void NetworkAddress::SetPort(uint16 port)
{
	switch (this->address.ss_family) {
		case AF_UNSPEC:
		case AF_INET:
			((struct sockaddr_in*)&this->address)->sin_port = htons(port);
			break;

		case AF_INET6:
			((struct sockaddr_in6*)&this->address)->sin6_port = htons(port);
			break;

		default:
			NOT_REACHED();
	}
}

/**
 * Get the address as a string, e.g. 127.0.0.1:12345.
 * @param buffer the buffer to write to
 * @param last the last element in the buffer
 * @param with_family whether to add the family (e.g. IPvX).
 */
void NetworkAddress::GetAddressAsString(char *buffer, const char *last, bool with_family)
{
	if (this->GetAddress()->ss_family == AF_INET6) buffer = strecpy(buffer, "[", last);
	buffer = strecpy(buffer, this->GetHostname(), last);
	if (this->GetAddress()->ss_family == AF_INET6) buffer = strecpy(buffer, "]", last);
	buffer += seprintf(buffer, last, ":%d", this->GetPort());

	if (with_family) {
		char family;
		switch (this->address.ss_family) {
			case AF_INET:  family = '4'; break;
			case AF_INET6: family = '6'; break;
			default:       family = '?'; break;
		}
		seprintf(buffer, last, " (IPv%c)", family);
	}
}

/**
 * Get the address as a string, e.g. 127.0.0.1:12345.
 * @param with_family whether to add the family (e.g. IPvX).
 * @return the address
 * @note NOT thread safe
 */
const char *NetworkAddress::GetAddressAsString(bool with_family)
{
	/* 6 = for the : and 5 for the decimal port number */
	static char buf[NETWORK_HOSTNAME_LENGTH + 6 + 7];
	this->GetAddressAsString(buf, lastof(buf), with_family);
	return buf;
}

/**
 * Helper function to resolve without opening a socket.
 * @param runp information about the socket to try not
 * @return the opened socket or INVALID_SOCKET
 */
static SOCKET ResolveLoopProc(addrinfo *runp)
{
	/* We just want the first 'entry', so return a valid socket. */
	return !INVALID_SOCKET;
}

/**
 * Get the address in its internal representation.
 * @return the address
 */
const sockaddr_storage *NetworkAddress::GetAddress()
{
	if (!this->IsResolved()) {
		/* Here we try to resolve a network address. We use SOCK_STREAM as
		 * socket type because some stupid OSes, like Solaris, cannot be
		 * bothered to implement the specifications and allow '0' as value
		 * that means "don't care whether it is SOCK_STREAM or SOCK_DGRAM".
		 */
		this->Resolve(this->address.ss_family, SOCK_STREAM, AI_ADDRCONFIG, NULL, ResolveLoopProc);
		this->resolved = true;
	}
	return &this->address;
}

/**
 * Checks of this address is of the given family.
 * @param family the family to check against
 * @return true if it is of the given family
 */
bool NetworkAddress::IsFamily(int family)
{
	if (!this->IsResolved()) {
		this->Resolve(family, SOCK_STREAM, AI_ADDRCONFIG, NULL, ResolveLoopProc);
	}
	return this->address.ss_family == family;
}

/**
 * Checks whether this IP address is contained by the given netmask.
 * @param netmask the netmask in CIDR notation to test against.
 * @note netmask without /n assumes all bits need to match.
 * @return true if this IP is within the netmask.
 */
bool NetworkAddress::IsInNetmask(char *netmask)
{
	/* Resolve it if we didn't do it already */
	if (!this->IsResolved()) this->GetAddress();

	int cidr = this->address.ss_family == AF_INET ? 32 : 128;

	NetworkAddress mask_address;

	/* Check for CIDR separator */
	char *chr_cidr = strchr(netmask, '/');
	if (chr_cidr != NULL) {
		int tmp_cidr = atoi(chr_cidr + 1);

		/* Invalid CIDR, treat as single host */
		if (tmp_cidr > 0 || tmp_cidr < cidr) cidr = tmp_cidr;

		/* Remove and then replace the / so that NetworkAddress works on the IP portion */
		*chr_cidr = '\0';
		mask_address = NetworkAddress(netmask, 0, this->address.ss_family);
		*chr_cidr = '/';
	} else {
		mask_address = NetworkAddress(netmask, 0, this->address.ss_family);
	}

	if (mask_address.GetAddressLength() == 0) return false;

	uint32 *ip;
	uint32 *mask;
	switch (this->address.ss_family) {
		case AF_INET:
			ip = (uint32*)&((struct sockaddr_in*)&this->address)->sin_addr.s_addr;
			mask = (uint32*)&((struct sockaddr_in*)&mask_address.address)->sin_addr.s_addr;
			break;

		case AF_INET6:
			ip = (uint32*)&((struct sockaddr_in6*)&this->address)->sin6_addr;
			mask = (uint32*)&((struct sockaddr_in6*)&mask_address.address)->sin6_addr;
			break;

		default:
			NOT_REACHED();
	}

	while (cidr > 0) {
		uint32 msk = cidr >= 32 ? (uint32)-1 : htonl(-(1 << (32 - cidr)));
		if ((*mask++ & msk) != (*ip++ & msk)) return false;

		cidr -= 32;
	}

	return true;
}

extern "C" {

void async_connect(void *socket) {
	SOCKET sock = (SOCKET)socket;
	printf("do connect: %d\n", sock);
	struct sockaddr_in stSockAddr;
	memset(&stSockAddr, 0, sizeof(stSockAddr));

	stSockAddr.sin_family = AF_INET;
	stSockAddr.sin_port = htons(3980);
	int res = inet_pton(AF_INET, "91.228.153.235", &stSockAddr.sin_addr);

	if (0 > res) {
		throw "Unable to connect";
	} else if (0 == res) {
		throw "Unable to connect";
	}

	if (connect(sock, (struct sockaddr *)&stSockAddr, sizeof(stSockAddr)) != 0) {
		throw "Unable to connect";
	}

	/* Connection succeeded */
	if (!SetNonBlocking(sock)) {
		DEBUG(net, 0, "setting non-blocking mode failed");
	}
}

}

/**
 * Resolve this address into a socket
 * @param family the type of 'protocol' (IPv4, IPv6)
 * @param socktype the type of socket (TCP, UDP, etc)
 * @param flags the flags to send to getaddrinfo
 * @param sockets the list of sockets to add the sockets to
 * @param func the inner working while looping over the address info
 * @return the resolved socket or INVALID_SOCKET.
 */
SOCKET NetworkAddress::Resolve(int family, int socktype, int flags, SocketList *sockets, LoopProc func)
{
	if (func != ConnectLoopProc) {
		return INVALID_SOCKET;
	} else {
		SOCKET sock = socket(PF_INET, SOCK_STREAM, IPPROTO_TCP);

		if (sock == INVALID_SOCKET) {
			throw "Unable to connect";
		}

		if (!SetNoDelay(sock)) {
			DEBUG(net, 1, "setting TCP_NODELAY failed");
		}

		printf("schedule connect: %d\n", sock);
		emscripten_async_call(async_connect, (void *)sock, 10);

		return sock;
	}
}

/**
 * Helper function to resolve a connected socket.
 * @param runp information about the socket to try not
 * @return the opened socket or INVALID_SOCKET
 */
static SOCKET ConnectLoopProc(addrinfo *runp)
{
	const char *type = NetworkAddress::SocketTypeAsString(runp->ai_socktype);
	const char *family = NetworkAddress::AddressFamilyAsString(runp->ai_family);
	const char *address = NetworkAddress(runp->ai_addr, (int)runp->ai_addrlen).GetAddressAsString();

	SOCKET sock = socket(runp->ai_family, runp->ai_socktype, runp->ai_protocol);
	if (sock == INVALID_SOCKET) {
		DEBUG(net, 1, "[%s] could not create %s socket: %s", type, family, strerror(errno));
		return INVALID_SOCKET;
	}

	if (!SetNoDelay(sock)) DEBUG(net, 1, "[%s] setting TCP_NODELAY failed", type);

	if (connect(sock, runp->ai_addr, (int)runp->ai_addrlen) != 0) {
		DEBUG(net, 1, "[%s] could not connect %s socket: %s", type, family, strerror(errno));
		closesocket(sock);
		return INVALID_SOCKET;
	}

	/* Connection succeeded */
	if (!SetNonBlocking(sock)) DEBUG(net, 0, "[%s] setting non-blocking mode failed", type);

	DEBUG(net, 1, "[%s] connected to %s", type, address);

	return sock;
}

/**
 * Connect to the given address.
 * @return the connected socket or INVALID_SOCKET.
 */
SOCKET NetworkAddress::Connect()
{
	DEBUG(net, 1, "Connecting to %s", this->GetAddressAsString());

	return this->Resolve(AF_UNSPEC, SOCK_STREAM, AI_ADDRCONFIG, NULL, ConnectLoopProc);
}

/**
 * Helper function to resolve a listening.
 * @param runp information about the socket to try not
 * @return the opened socket or INVALID_SOCKET
 */
static SOCKET ListenLoopProc(addrinfo *runp)
{
	const char *type = NetworkAddress::SocketTypeAsString(runp->ai_socktype);
	const char *family = NetworkAddress::AddressFamilyAsString(runp->ai_family);
	const char *address = NetworkAddress(runp->ai_addr, (int)runp->ai_addrlen).GetAddressAsString();

	SOCKET sock = socket(runp->ai_family, runp->ai_socktype, runp->ai_protocol);
	if (sock == INVALID_SOCKET) {
		DEBUG(net, 0, "[%s] could not create %s socket on port %s: %s", type, family, address, strerror(errno));
		return INVALID_SOCKET;
	}

	if (runp->ai_socktype == SOCK_STREAM && !SetNoDelay(sock)) {
		DEBUG(net, 3, "[%s] setting TCP_NODELAY failed for port %s", type, address);
	}

	int on = 1;
	/* The (const char*) cast is needed for windows!! */
	if (setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, (const char*)&on, sizeof(on)) == -1) {
		DEBUG(net, 3, "[%s] could not set reusable %s sockets for port %s: %s", type, family, address, strerror(errno));
	}

	if (runp->ai_family == AF_INET6 &&
			setsockopt(sock, IPPROTO_IPV6, IPV6_V6ONLY, (const char*)&on, sizeof(on)) == -1) {
		DEBUG(net, 3, "[%s] could not disable IPv4 over IPv6 on port %s: %s", type, address, strerror(errno));
	}

	if (bind(sock, runp->ai_addr, (int)runp->ai_addrlen) != 0) {
		DEBUG(net, 1, "[%s] could not bind on %s port %s: %s", type, family, address, strerror(errno));
		closesocket(sock);
		return INVALID_SOCKET;
	}

	if (runp->ai_socktype != SOCK_DGRAM && listen(sock, 1) != 0) {
		DEBUG(net, 1, "[%s] could not listen at %s port %s: %s", type, family, address, strerror(errno));
		closesocket(sock);
		return INVALID_SOCKET;
	}

	/* Connection succeeded */
	if (!SetNonBlocking(sock)) DEBUG(net, 0, "[%s] setting non-blocking mode failed for %s port %s", type, family, address);

	DEBUG(net, 1, "[%s] listening on %s port %s", type, family, address);
	return sock;
}

/**
 * Make the given socket listen.
 * @param socktype the type of socket (TCP, UDP, etc)
 * @param sockets the list of sockets to add the sockets to
 */
void NetworkAddress::Listen(int socktype, SocketList *sockets)
{
	assert(sockets != NULL);

	/* Setting both hostname to NULL and port to 0 is not allowed.
	 * As port 0 means bind to any port, the other must mean that
	 * we want to bind to 'all' IPs. */
	if (this->address_length == 0 && this->address.ss_family == AF_UNSPEC &&
			StrEmpty(this->hostname) && this->GetPort() == 0) {
		this->Resolve(AF_INET,  socktype, AI_ADDRCONFIG | AI_PASSIVE, sockets, ListenLoopProc);
		this->Resolve(AF_INET6, socktype, AI_ADDRCONFIG | AI_PASSIVE, sockets, ListenLoopProc);
	} else {
		this->Resolve(AF_UNSPEC, socktype, AI_ADDRCONFIG | AI_PASSIVE, sockets, ListenLoopProc);
	}
}

/**
 * Convert the socket type into a string
 * @param socktype the socket type to convert
 * @return the string representation
 * @note only works for SOCK_STREAM and SOCK_DGRAM
 */
/* static */ const char *NetworkAddress::SocketTypeAsString(int socktype)
{
	switch (socktype) {
		case SOCK_STREAM: return "tcp";
		case SOCK_DGRAM:  return "udp";
		default:          return "unsupported";
	}
}

/**
 * Convert the address family into a string
 * @param family the family to convert
 * @return the string representation
 * @note only works for AF_INET, AF_INET6 and AF_UNSPEC
 */
/* static */ const char *NetworkAddress::AddressFamilyAsString(int family)
{
	switch (family) {
		case AF_UNSPEC: return "either IPv4 or IPv6";
		case AF_INET:   return "IPv4";
		case AF_INET6:  return "IPv6";
		default:        return "unsupported";
	}
}

#endif /* ENABLE_NETWORK */
