use strict;
use warnings;
use diagnostics;

my $source = $ARGV[0];

opendir F, $source;
my @files = readdir F;

for (@files) {
	my $ogg = $_;
	$ogg =~ s/.mp3/.ogg/g;

	system("ffmpeg -i $source/$_ $ogg.wav");
	system("oggenc -q 6 $ogg.wav -o $ogg");
	system("rm -v *.wav");
}

closedir F;