package PlayTTD::Index;

use Dancer ':syntax';
use PlayTTD::Status;

#Routing

get '/' => sub {
  var 'status' => PlayTTD::Status::now();
  template 'index';
};

true;