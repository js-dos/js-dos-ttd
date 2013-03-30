package PlayTTD::Play;

use Dancer ':syntax';

my $title = "Transport tycoon deluxe - Single-player";
my $meta  = "In single-player mode you can play in Transport Tycoon against computer (AI: AdmiralAI, AIAI, NoCAB, SimpleAI, Trans AI).";

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
        { 
          pageTitle => $title,
          pageMeta => $meta,
          arguments => "['-m', 'null']"
        }, 
        { layout => 'empty' };
    } else {
      template 'play', 
        { 
          pageTitle => $title,
          pageMeta => $meta,
          arguments => "['-m', 'em_midi']" 
        },  
        { layout => 'empty' };
    }
  } else {
    redirect '/commons/login/?go=/play/';
  }
};

true;