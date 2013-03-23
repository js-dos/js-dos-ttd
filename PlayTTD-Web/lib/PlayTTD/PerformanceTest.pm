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
  my $player =  var 'player';

  if ($player->noSound()) {
    template 'performance-test', 
      { arguments => "['-m', 'null']" },
      { layout => 'empty' };
  } else {
    template 'performance-test', 
      { arguments => "['-m', 'em_midi']" },
      { layout => 'empty' };
  }
};

true;