//
// -- COOKIE CHECK
//

if (!UUID) {
  throw "UUID not set unable to start game";
}

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

Module['SAVE_GAME'] = function(file) {
  file = file.replace(/\/\//g, "/");
  
  if (file != "/home/caiiiycuk/play-ttd/etc/preload/save/saved_on_server.sav") {
    alert('This game saved in memory! You can save game on server with saved_on_server.sav file.');
    return;
  }

  var fs_object = Module["FS_findObject"](file);
  var contents = fs_object.v || fs_object.contents;
  var array = new Uint8Array(contents);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/push-save/" + Module['UUID'] + "/saved_on_server.sav", true);
  xhr.setRequestHeader('X-UUID', Module['UUID']);
  xhr.onload = function(e) { 
    alert('This game is saved on the server!');
  };
  xhr.send(array.buffer);
};

Module['print'] = function(text) {
  console.log(text);
};

//Module['noInitialRun'] = true;