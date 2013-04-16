== openttd.cpp ==
#include <ctime>

//GameLoop

static time_t updatedAt = 0;

if (difftime(time(0), updatedAt) > 5*60) {
  updatedAt = time(0);

  char buffer[255];
  sprintf(buffer, "echo ==_SERVER_STATUS(TIME:%li)_==", updatedAt);

  IConsoleCmdExec(buffer);
  IConsoleCmdExec("echo ===_SERVER_INFO_===");
  IConsoleCmdExec("serverinfo");
  IConsoleCmdExec("echo ===_COMPANIES_===");
  IConsoleCmdExec("companies");
  IConsoleCmdExec("echo ===_CLIENTS_===");
  IConsoleCmdExec("clients");
  IConsoleCmdExec("echo ==_END_==");
}