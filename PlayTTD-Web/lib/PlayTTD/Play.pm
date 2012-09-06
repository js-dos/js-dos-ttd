package PlayTTD::Play;

use Dancer ':syntax';

# Routing

get '/play_just_now.html' => sub {
	redirect '/play/', 301;
};

get '/play' => sub {
	redirect '/play/', 301;
};

get '/play/' => sub {
	template 'play', {}, { layout => 'empty' };
};

true;