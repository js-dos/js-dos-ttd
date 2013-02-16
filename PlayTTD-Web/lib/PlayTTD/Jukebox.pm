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
          [ 'legacy/stylesheets/jukebox/jukebox.css', 'legacy/stylesheets/jukebox/jplayer.blue.monday.css' ]
      },
      { layout => 'jukebox' };
};

true;