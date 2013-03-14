package PlayTTD::OpenTTD;

use Dancer ':syntax';

# Routing

get '/**/openttd.data' => sub {
	redirect "/openttd.data", 301;
};

get '/**/openttd.js' => sub {
	redirect "/openttd.js", 301;
};

get '/openttd.data' => sub {
	send_file(asset('openttd.data'), system_path => 1);
};

get '/openttd.js' => sub {
	send_file(asset('openttd.js'), system_path => 1);
};

# Impl

sub asset {
	return config->{'data'} . config->{'folder'} . shift;
}

true;