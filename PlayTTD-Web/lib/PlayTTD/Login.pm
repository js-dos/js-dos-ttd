package Login;

use Dancer ':syntax';
use Try::Tiny;

get '/login' => sub {
	redirect '/login/', 301;
};

get '/login/' => sub {
	template 'login';
};

post '/login/' => sub {
	my $name = param 'name';
	my $password = param 'password';

	try {
		my $uuid = Player::uuidByName($name);
		die "Wrong login or password\n" unless $uuid;
		
		my $player = new Player($uuid);	
		die "Wrong login or password\n" unless ($player->matchPassword($password));

		cookie 'ttd-save-uuid' => $player->uuid();
		redirect '/';
	} catch {
		template 'login', {error => $_};
	};

	
};

true;