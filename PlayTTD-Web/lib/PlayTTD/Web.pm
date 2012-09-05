package PlayTTD::Web;
use Dancer ':syntax';

our $VERSION = '0.1';

get '/' => sub {
    template 'index';
};

get '/**/openttd.data' => sub {
	redirect "/openttd.data", 301;
};

get '/**/openttd.js' => sub {
	redirect "/openttd.js", 301;
};

# Play routing

get '/play_just_now.html' => sub {
	redirect '/play/', 301;
};

get '/play' => sub {
	redirect '/play/', 301;
};

get '/play/' => sub {
	template 'play', {}, { layout => 'empty' };
};

# Performance test routing

get '/perfomance_test.html' => sub {
	redirect '/performance-test/', 301;
};

get '/performance-test' => sub {
	redirect '/performance-test/', 301;
};

get '/performance-test/' => sub {
	template 'performance-test', {}, { layout => 'empty' };
};

# Jukebox routing

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
