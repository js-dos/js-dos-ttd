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
  my $player =  var 'player';
  
  if ($player->activated()) {
    if ($player->noSound()) {
      template 'play', 
        { arguments => "['-m', 'null']" }, 
        { layout => 'empty' };
    } else {
      template 'play', 
        { arguments => "['-m', 'em_midi']" },  
        { layout => 'empty' };
    }
  } else {
    redirect '/commons/login/?go=/play/';
  }
};

true;