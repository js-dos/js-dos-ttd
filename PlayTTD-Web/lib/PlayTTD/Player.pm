package Player;

use Dancer ':syntax';
use Dancer::Plugin::Redis;
use Digest::MD5 qw(md5_base64);

sub new {
    my $class = shift;
    my $uuid = shift;

    my $self = loadFromStorage($uuid);

    unless ($self) {
        $self = bless { uuid => $uuid }, $class;
        $self->{name} = 'player#' . $self->{uuid};
        $self->{password} = '';
        $self->{noSound} = 0;
    }

    return $self;
}

sub loadFromStorage {
    my $uuid = shift;
    my $yaml = redis->get($uuid);
    
    return 0 unless $yaml;

    return from_yaml($yaml);
}

sub setName {
    my ($self, $name) = @_;

    if (nameIsNotUsed($name)) {
        $self->{name} = $name;
    } else {
        my $uuid = uuidByName($name);
        if ($self->{uuid} eq $uuid) {
            $self->{name} = $name;
        }
    }
}

sub setPassword {
    my ($self, $password) = @_;
    $self->{password} = makePassword($password);
}

sub matchPassword {
    my ($self, $password) = @_;

    unless ($self->{password}) {
        return 1;
    }

    return $self->{password} eq makePassword($password);
}

sub setNoSound {
    my ($self, $noSound) = @_;
    $self->{noSound} = $noSound;
}

sub makePassword {
    return md5_base64 shift;
}

sub update {
    my $self = shift;
    debug to_yaml $self;
    redis->set($self->{uuid}, to_yaml($self));
    redis->set($self->{name}, $self->{uuid});
}

sub nameIsUsed {
    return defined redis->get(shift);
}

sub nameIsNotUsed {
    return !nameIsUsed(shift);
}

sub uuidByName {
    return redis->get(shift);
}

sub name {
    my $self = shift;
    return $self->{name};
}

sub uuid {
    my $self = shift;
    return $self->{uuid};
}

1;

true;
