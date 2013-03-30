package PlayTTD::Play;

use Dancer ':syntax';

my $title = "Transport tycoon deluxe - Multiplayer";
my $meta  = "In multiplayer mode you can play in Transport Tycoon against other players.";

# Routing

get '/multiplayer' => sub {
  redirect '/multiplayer/', 301;
};

get '/multiplayer/' => sub {
  my $player =  var 'player';
  
  if ($player->activated()) {
    if ($player->noSound()) {
      template 'play', 
        { 
          pageTitle => $title,
          pageMeta => $meta,
          arguments => "['-m', 'null', '-n', '91.228.153.235:3980']" 
        }, 
        { layout => 'empty' };
    } else {
      template 'play', 
        { 
          pageTitle => $title,
          pageMeta => $meta,
          arguments => "['-m', 'em_midi', '-n', '91.228.153.235:3980']" 
        }, 
        { layout => 'empty' };
    }
  } else {
    redirect '/commons/login/?go=/multiplayer/';
  }
};

true;