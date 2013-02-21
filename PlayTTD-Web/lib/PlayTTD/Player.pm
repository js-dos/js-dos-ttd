package Player;

use Dancer ':syntax';
use Dancer::Plugin::Mongo;
use Digest::MD5 qw(md5_base64);

sub new {
    my $class = shift;
    my $uuid = shift;

    my $self = loadFromStorage($uuid);

    $self = bless { uuid => $uuid }, $class unless $self;
    $self->{name} = 'player#' . $self->{uuid} unless $self->{name};
    $self->{password} = '' unless $self->{password};
    $self->{noSound} = 0 unless $self->{noSound};
    $self->{activated} = 0 unless $self->{activated};

    return $self;
}

sub loadFromStorage {
    my $uuid = shift;
    my $player = mongo->ttd->players->find_one({ id => $uuid });
    return 0;
}

sub setName {
    my ($self, $name) = @_;
    $self->{name} = $name;
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

    unless ($self->{activated}) {
        $self->{activated} = 1;
        $self->addAchievement(PlayTTD::Achievement::ActivatedProfile());
    }

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
