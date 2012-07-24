function setCookie(c_name,value,exdays) {
  var exdate=new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie=c_name + "=" + c_value;
};

function getCookie(c_name) {
  var i,x,y,ARRcookies=document.cookie.split(";");
  for (i=0;i<ARRcookies.length;i++) {
    x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
    y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
    x=x.replace(/^\s+|\s+$/g,"");
    if (x==c_name) {
      return unescape(y);
    }
  }
};

function guidGen() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
};

function readUUID() {
  var guid = getCookie('ttd-save-uuid');
  if (guid == null || guid == "") {
    guid = guidGen();
    setCookie('ttd-save-uuid', guid, 365*20);
  }

  Module['UUID'] = guid;
};

// --
// -- EM_MIDI --
// --

Module['EM_MIDI_AUDIO'] = new Audio();

var _em_midi_play = function(ptr) {
  var filename = Pointer_stringify(ptr);
  var url = 'http://play-ttd.com/gm/' + filename.substr(-11);
  console.log('Playing song: ' + url);
  
  Module['EM_MIDI_AUDIO'].src = url;
  Module['EM_MIDI_AUDIO'].play();
};

var _em_midi_stop = function() {
  Module['EM_MIDI_AUDIO'].src = Module['EM_MIDI_AUDIO'].src; // rewind
  Module['EM_MIDI_AUDIO'].pause();
};

var _em_midi_is_playing = function() {
  return !(Module['EM_MIDI_AUDIO'].paused || Module['EM_MIDI_AUDIO'].ended);
};

var _em_midi_volume = function(vol) {
  Module['EM_MIDI_AUDIO'].volume = vol / 256;
};

// --
// -- MUSIC MOCKS
// --

function createMusicFiles() {
  var emptyDataFile = new Uint8Array(0);
  
  // FS.createPath('/', 'home/caiiiycuk/play-ttd/etc/preload/save', true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt00.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt01.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt02.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt03.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt04.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt05.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt06.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt07.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt08.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt09.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt10.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt11.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt12.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt13.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt14.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt15.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt16.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt17.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt18.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt19.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt20.ogg', emptyDataFile, true, true);
  FS.createDataFile('/home/caiiiycuk/play-ttd/etc/preload/gm', 'gm_tt21.ogg', emptyDataFile, true, true);
}    

// --
// -- MISC --
// --

var _playttd_set_canvas_size = function(width, height) {
  width = width + 'px';
  height = height + 'px';

  if (Module['canvas'].style.width !== width ||
    Module['canvas'].style.height !== height) {
    Module['canvas'].style.width = width;
    Module['canvas'].style.height = height;
  }
}

// ----------

Module['SAVE_GAME'] = function(file) {
  file = file.replace(/\/\//g, "/");
  
  if (file != "/home/caiiiycuk/play-ttd/etc/preload/save/saved_on_server.sav") {
    alert('This game saved in memory! You can save game on server with saved_on_server.sav file.');
    return;
  }

  var fs_object = FS.findObject(file);
  var contents = fs_object.contents;
  var array = new Uint8Array(contents);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://play-ttd.com/save/save.php", true);
  xhr.setRequestHeader('X-UUID', Module['UUID']);
  xhr.onload = function(e) { 
    alert('This game is saved on the server!');
  };
  xhr.send(array.buffer);
};

Module['print'] = function(text) {
  console.log(text);
};

Module['noInitialRun'] = true;