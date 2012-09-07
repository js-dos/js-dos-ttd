package PlayTTD::Save;

use Dancer ':syntax';

# Routing

post '/push-save/:uuid/:file' => sub {
	PlayTTD::Save::write(param('file'), param('uuid'), request->{body});
};

get '/save/:file' => sub {
	PlayTTD::Save::read(param('file'));
};

get '/save/:uuid/:file' => sub {
	PlayTTD::Save::read(param('file'), param('uuid'));
};

# Impl

sub mockFile {
	return config->{'data'} . 'save/empty_slot.sav';
}

sub root {
	my $uuid = shift;
	my $root = config->{'data'} . 'save/';
	$root .= $uuid . '/' if $uuid;
	return $root;
}

sub write {
	my ($file, $uuid, $body) = @_;

	my $root = root($uuid);
	mkdir($root) unless (-d $root);

	my $target = $root . $file;

	open F, ">$target";
	binmode F;
	print F $body;
	close F;
};

sub read {
	my ($file, $uuid) = @_;

	my $root = root($uuid);
	my $target = $root . $file;
	
	if (-e $target) {
		send_file($target, system_path => 1);
	} else {
		send_file(mockFile(), system_path => 1);
	}
};

true;