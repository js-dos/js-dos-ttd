package PlayTTD::Play;

use Dancer ':syntax';

# Routing

get '/multiplayer' => sub {
	redirect '/multiplayer/', 301;
};

get '/multiplayer/' => sub {
	my $player =  var 'player';
	
	if ($player->activated()) {
		var 'arguments', "['-n', '91.228.153.235:3980']";
		template 'play', {}, { layout => 'empty' };
	} else {
		template 'multiplayer-forbidden';
	}
};

true;