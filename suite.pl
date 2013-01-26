use strict;
use warnings;
use diagnostics;

use Getopt::Std;
$Getopt::Std::STANDARD_HELP_VERSION = 1;  # Use standard-conforming behavior

use FindBin;
use lib 'lib';
use EMMakePatcher;

my $emscripten 	= '/home/caiiiycuk/em-sandbox/emscripten';
my $gcc_source	= "$FindBin::Bin/ttd-source";
my $ttd_patch	= "$FindBin::Bin/ttd-patch";
my $em_source	= "$FindBin::Bin/ttd-emscripten";
my $etc 		= "$FindBin::Bin/etc";
my $root 		= $FindBin::Bin;

my %opts = ();
getopts('gne', \%opts);

chdir($root);

if ($opts{g}) {
	print "Configure for gcc\n";

	system('rm -rfv gcc-build');
	system('mkdir gcc-build');
	chdir('gcc-build');
	system("$gcc_source/configure --without-libtimidity --without-allegro --without-cocoa --without-zlib --without-liblzma --without-liblzo2 --without-png --without-freetype --without-fontconfig --without-icu --without-iconv --without-psp-config --without-ccache --without-distcc --without-threads --endian=LE --disable-unicode --enable-debug=3");
	chdir('..');
}

if ($opts{e}) {
	print "Configure for emscripten\n";

	system('rm -rfv emcc-build');
	system("rm -rfv $em_source");
	system('mkdir emcc-build');
	system("mkdir $em_source");
	system("cp -rv $gcc_source/* $em_source/");
	system("cp -rv $ttd_patch/* $em_source/");

	chdir('emcc-build');
	system("$emscripten/emconfigure $em_source/configure --without-libtimidity --without-allegro --without-cocoa --without-zlib --without-liblzma --without-liblzo2 --without-png --without-freetype --without-fontconfig --without-icu --without-iconv --without-psp-config --without-ccache --without-distcc --without-threads --endian=LE --disable-unicode");
	chdir('..');

	system("cp -v $gcc_source/src/rev.cpp $em_source/src/rev.cpp");

	patch(
		'emcc-build', 
		$emscripten, 
		$etc, 
		"$root/gcc-build/objs/debug/endian_check",
		"$root/gcc-build/objs/lang/strgen",
		"$root/gcc-build/objs/setting/settings_gen");
}

if ($opts{n}) {
	print "Building gcc\n";

	chdir('gcc-build');
	system("VERBOSE=1 make -j3");
	chdir('..');
}


sub main::HELP_MESSAGE {
    print << 'USAGE';
Usage: perl suite.pl [flags]
	-g: (gcc) configure gcc
	-n: (native) compile gcc version
	-e: (emscipten) configure emscipten
USAGE
}

sub main::VERSION_MESSAGE {
    print "Version 1.0\n";
}