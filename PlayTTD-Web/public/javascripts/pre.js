// --
// -- PRE RUN 
// --

Module['preRun'] = function() { 
    SDL.defaults.copyOnLock = false;
    Module.screenIsReadOnly = true;
    Module["FS_findObject"] = FS.findObject;
    Module['playttd_prerun']();
}

// --
// -- SCRIPT 
// --

_getStartupScript = function() {
  var script = Module['getStartupScript']();
  var buffer = _malloc(script.length + 1);
  Module['writeStringToMemory'](script, buffer);
  return buffer;
}

// --
// -- EM_MIDI --
// --

Module['EM_MIDI_AUDIO'] = new Audio();

_em_midi_play = function(ptr) {
  var filename = Pointer_stringify(ptr);
  var url = 'http://play-ttd.com/gm/' + filename.substr(-11);
  console.log('Playing song: ' + url);
  
  Module['EM_MIDI_AUDIO'].src = url;
  Module['EM_MIDI_AUDIO'].play();
};

_em_midi_stop = function() {
  Module['EM_MIDI_AUDIO'].src = Module['EM_MIDI_AUDIO'].src; // rewind
  Module['EM_MIDI_AUDIO'].pause();
};

_em_midi_is_playing = function() {
  return !(Module['EM_MIDI_AUDIO'].paused || Module['EM_MIDI_AUDIO'].ended);
};

_em_midi_volume = function(vol) {
  Module['EM_MIDI_AUDIO'].volume = vol / 256;
};

// --
// -- MISC --
// --

_playttd_set_canvas_size = function(width, height) {
  width = width + 'px';
  height = height + 'px';

  if (Module['canvas'].style.width !== width ||
    Module['canvas'].style.height !== height) {
    Module['canvas'].style.width = width;
    Module['canvas'].style.height = height;
  }
}

_playttd_fps_counter = function () {
  _this = this;
  this.startTime = Date.now();
  this.frameCount = 0;
  this.inc = function () {
    var duration = Date.now() - _this.startTime;
    _this.frameCount++;
    
    if (duration > 5000 /* 30 sec */) {
      Module['update_fps'](_this.frameCount * 1000 / duration);
      _this.frameCount = 0;
      this.startTime = Date.now();  
    }
  }
}

_playttd_set_main_loop = function(func) {
  Module['noExitRuntime'] = true;

  var fps = new _playttd_fps_counter();
  var loop = function () {
    Module.dynCall_v(func);
    fps.inc();
  };
  
  var jsLoop = function() {
    loop();
    Browser.requestAnimationFrame(jsLoop);
  }

  Browser.requestAnimationFrame(jsLoop);
}

// --
// -- SAVE GAME
// --

Module['SAVE_GAME'] = function(file) {
  file = file.replace(/\/\//g, "/");
  
  // if (file != "/home/caiiiycuk/play-ttd/etc/preload/save/saved_on_server.sav") {
  //   alert('This game saved in memory! You can save game on server with saved_on_server.sav file.');
  //   return;
  // }

  var fileName = /\/([^/]+)$/.exec(file)[1]

  var fs_object = Module["FS_findObject"](file);
  var contents = fs_object.contents;
  var array = new Uint8Array(contents);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/save/" + Module['UUID'] + "/" + fileName, true);
  xhr.setRequestHeader('X-UUID', Module['UUID']);
  xhr.onload = function(e) { 
    alert('This game is saved on the server!');
  };
  xhr.send(array.buffer);
};