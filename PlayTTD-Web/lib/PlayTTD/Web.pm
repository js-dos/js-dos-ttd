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

# Save

post '/save/:uuid/:file' => sub {
	writeSaveFile(param('file'), param('uuid'), request->{body});
};

get '/save/:file' => sub {
	readSaveFile(param('file'));
};

get '/save/:uuid/:file' => sub {
	readSaveFile(param('file'), param('uuid'));
};

sub writeSaveFile {
	my ($file, $uuid, $body) = @_;

	my $asset = config->{'data'} . 'save/';
	my $saveFolder = $asset . $uuid;

	mkdir($saveFolder);

	my $saveFile = $saveFolder . '/' . $file;

	open F, ">$saveFile";
	binmode F;
	print F $body;
	close F;
};

sub readSaveFile {
	my ($file, $uuid) = @_;

	my $asset = config->{'data'} . 'save/';
	
	my $saveFile;
	if ($uuid) {
 		$saveFile = $asset . $uuid . '/' . $file;
	} else {
		$saveFile = $asset . $file
	}

	if (-e $saveFile) {
		send_file($saveFile, system_path => 1);
	} else {
		send_file($asset . 'empty_slot.sav', system_path => 1);
	}
};

true;
