package PlayTTD::Achievement;

my %achievements = (
	activatedProfile => 'Thank you for your registration'
);

sub ActivatedProfile {
	return 'activatedProfile';
};

sub LongName {
	my $achievement = shift;
	return undef unless $achievement;
	return $achievements{ $achievement };
};

true;