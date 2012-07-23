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