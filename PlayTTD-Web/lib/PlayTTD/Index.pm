package PlayTTD::Index;

use Dancer ':syntax';

#Routing

get '/' => sub {
    template 'index';
};

true;