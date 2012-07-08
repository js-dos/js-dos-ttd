use strict;
use warnings;
use diagnostics;

use Getopt::Std;
$Getopt::Std::STANDARD_HELP_VERSION = 1;  # Use standard-conforming behavior

use FindBin;
use lib 'lib';
use EMMakePatcher;

my $emscripten 	= '/home/caiiiycuk/em-sandbox/emscripten';
my $source 		= "$FindBin::Bin/ttd-source";
my $etc 		= "$FindBin::Bin/etc";
my $root 		= $FindBin::Bin;

my %opts = ();
getopts('gne', \%opts);

# if ($opts{c}) {
# 	configure($settings);
# }

chdir($root);

if ($opts{g}) {
	print "Configure for gcc\n";

	system('rm -rfv gcc-build');
	system('mkdir gcc-build');
	chdir('gcc-build');
	system("$source/configure --without-libtimidity --without-allegro --without-cocoa --without-zlib --without-liblzma --without-liblzo2 --without-png --without-freetype --without-fontconfig --without-icu --without-iconv --without-psp-config --without-ccache --without-distcc --without-threads --endian=LE --disable-network --disable-unicode --enable-debug=3");
	chdir('..');
}

if ($opts{e}) {
	print "Configure for emscripten\n";

	system('rm -rfv emcc-build');
	system('mkdir emcc-build');
	chdir('emcc-build');
	system("$emscripten/emconfigure $source/configure --without-libtimidity --without-allegro --without-cocoa --without-zlib --without-liblzma --without-liblzo2 --without-png --without-freetype --without-fontconfig --without-icu --without-iconv --without-psp-config --without-ccache --without-distcc --without-threads --endian=LE --disable-network --disable-unicode");
	chdir('..');

	#pathced sources
	system("ln -s $etc/src/gfxinit_patched.cpp $source/src/gfxinit_patched.cpp");
	system("ln -s $etc/src/video/sdl_v_patched.cpp $source/src/video/sdl_v_patched.cpp");
	system("ln -s $etc/src/music/em_midi.h $source/src/music/em_midi.h");
	system("ln -s $etc/src/music/em_midi.cpp $source/src/music/em_midi.cpp");
	
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


# if ($opts{e}) {
# 	chdir($settings->{source} . '/objs/emscripten');
# 	system("VERBOSE=1 make -j3");
# 	system("cp openttd.data $FindBin::Bin/out/openttd.data");
# 	system("cp openttd.html $FindBin::Bin/out/openttd.html");
# 	chdir('../../..');
# }

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