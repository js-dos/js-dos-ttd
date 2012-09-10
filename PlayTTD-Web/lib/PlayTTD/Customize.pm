package PlayTTD::Customize;

use Dancer ':syntax';

use Try::Tiny;

get '/customize' => sub {
	redirect '/customize/', 301;
};

get '/customize/' => sub {
	template 'customize';
};

post '/customize/' => sub {
	my $context = {};

	my $player =  var 'player';

	my $name = param 'name';
	my $password = param 'password';
	my $noSound = param 'no-sound';

	try {
		die "Wrong password\n" unless ($player->matchPassword($password));

		if (shouldChangeName($player, $name)) {
			changeName($player, $name);
		}

		$player->setPassword($password);
		$player->setNoSound(defined $noSound);
		$player->update();

		redirect '/';
	} catch {
		template 'customize', { error => $_ };
	};

	
};

sub shouldChangeName {
	my ($player, $name) = @_;
	return $player->name() ne $name;
};

sub changeName {
	my ($player, $name) = @_;

	die "Name '$name' is used by other player\n" if (Player::nameIsUsed($name));

	$player->setName($name);
};


true;