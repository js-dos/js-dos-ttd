package PlayTTD::Status;

use Dancer;
use File::ReadBackwards;
use Time::Piece;

my $updatedAt = 0;
my $status;

sub statusFromLog {
  my $status = {
    clients => 0,
    companies => 0,
    spectators => 0
  };

  my $file = 
    File::ReadBackwards->new( shift ) or return $status;

  until ($file->eof()) {
    my $line = $file->readline();
    if ($line =~ m|Current/maximum spectators:\s+(\d+)/(\d+)|) {
      $status->{spectators} = $1;
      
      if ($file->readline() =~ m|Current/maximum companies:\s+(\d+)/(\d+)|) {
        $status->{companies} = $1;
      }

      if ($file->readline() =~ m|Current/maximum clients:\s+(\d+)/(\d+)|) {
        $status->{clients} = $1;
      }

      last;
    }
  }

  $file->close();
  return $status;
}

sub now {
  if (abs(localtime()->min - $updatedAt) > 5) {
    $status = statusFromLog(config->{'server-log'});
    $updatedAt = localtime()->min;
  }

  return $status;
}

1;