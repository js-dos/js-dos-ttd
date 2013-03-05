package Player;

use Dancer ':syntax';
use Dancer::Plugin::Mongo;
use Digest::MD5 qw(md5_base64);

use Data::Dumper;

sub new {
    my $class = shift;
    my $uuid = shift;

    my $self = playerByUUID($uuid);

    if ($self) {
        $self = bless $self, $class;
    }

    $self = bless { _id => $uuid }, $class unless $self;
    $self->{name} = 'player#' . $self->{_id} unless $self->{name};
    $self->{password} = '' unless $self->{password};
    $self->{noSound} = 0 unless $self->{noSound};
    $self->{activated} = 0 unless $self->{activated};

    return $self;
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

sub nameIsUsed {
    return defined playerByName(shift);
}

sub nameIsNotUsed {
    return !nameIsUsed(shift);
}

sub name {
    my $self = shift;
    return $self->{name};
}

sub uuid {
    my $self = shift;
    return $self->{_id};
}

sub invited {
    my $self = shift;
    return $self->{invited};
}

sub activated {
    my $self = shift;
    return $self->{activated};   
}

#
# DAO
#

sub collection {
    return mongo
        ->get_database('play')
        ->get_collection('players');
}

sub playerByUUID {
    return collection()
        ->find_one({ _id => shift });
}

sub playerByName {
    return collection()
        ->find_one({ name => shift });
}

sub uuidByName {
    my $player = playerByName(shift);
    return unless $player;
    return $player->{_id};
}

sub update {
    my $self = shift;

    unless ($self->{activated}) {
        $self->{activated} = 1;
    }

    collection()->update(
        {'_id' => $self->{_id} },
        $self,
        {'upsert' => 1}
    );
}

true;