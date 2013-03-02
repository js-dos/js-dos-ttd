package Pre;

use Dancer ':syntax';

use UUID::Tiny;
use PlayTTD::Player;

hook before => sub {
	my $uuid = cookie 'ttd-save-uuid';

	unless ($uuid) {
		$uuid = create_UUID_as_string(UUID_V1);
		cookie 'ttd-save-uuid' => $uuid, expires => "1 year";
	}

	my $player = new Player($uuid);
	var 'player' => $player;
	var 'arguments' => '[]';
};

true;