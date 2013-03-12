package PlayTTD::Web;

use Dancer ':syntax';

our $VERSION = '0.1';

use Play::Commons;
use PlayTTD::OpenTTD;
use PlayTTD::Save;
use PlayTTD::Jukebox;
use PlayTTD::Play;
use PlayTTD::Multiplayer;
use PlayTTD::PerformanceTest;
use PlayTTD::Index;

any qr{.*} => sub {
	status 'not_found';
	template '404';
};

true;