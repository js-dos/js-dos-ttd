//
// -- DISABLE DEFAULTS FOR KEYS
//
window.addEventListener("keydown", function(event) {
  if(event.preventDefault) {
    event.preventDefault();
  }
});

//
// -- COOKIE CHECK
//

if (!UUID) {
  throw "UUID not set unable to start game";
}

//
// -- STARTUP SCRIPT
//

Module['getStartupScript'] = function() {
  return 'name ' + Engine['player-name'];
};

// --
// -- MUSIC MOCKS
// --

function createMusicFiles() {
  var emptyDataFile = new Uint8Array(0);
  
  // FS.createPath('/', 'home/caiiiycuk/play-ttd/etc/preload/save', true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt00.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt01.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt02.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt03.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt04.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt05.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt06.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt07.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt08.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt09.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt10.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt11.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt12.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt13.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt14.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt15.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt16.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt17.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt18.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt19.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt20.ogg', emptyDataFile, true, true);
  Module["FS_createDataFile"]('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt21.ogg', emptyDataFile, true, true);
}    

// ----------

Module['print'] = function(text) {
  console.log(text);
};

// Module['noInitialRun'] = true;