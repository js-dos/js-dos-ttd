package PlayTTD::PerformanceTest;

use Dancer ':syntax';

# Routing

get '/perfomance_test.html' => sub {
	redirect '/performance-test/', 301;
};

get '/performance-test' => sub {
	redirect '/performance-test/', 301;
};

get '/performance-test/' => sub {
	template 'performance-test', {}, { layout => 'empty' };
};

true;