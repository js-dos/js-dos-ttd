package PlayTTD::Jukebox;

use Dancer ':syntax';

# Routing

get '/jukebox.html' => sub {
	redirect '/jukebox/', 301;
};

get '/jukebox' => sub {
	redirect '/jukebox/', 301;
};

get '/jukebox/' => sub {
    template 'jukebox',
      { css =>
          [ 'css/jukebox/jukebox.css', 'css/jukebox/jplayer.blue.monday.css' ]
      };
};

true;