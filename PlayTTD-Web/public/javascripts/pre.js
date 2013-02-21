// --
// -- PRE RUN 
// --

Module['preRun'] = function() { 
    SDL.defaults.copyOnLock = false;
    Module["FS_findObject"] = FS.findObject;
    Module['playttd_prerun']();
}

// --
// -- SCRIPT 
// --

function _getStartupScript() {
  var script = Module['getStartupScript']();
  var buffer = _malloc(script.length + 1);
  Module['writeStringToMemory'](script, buffer);
  return buffer;
}

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

var _playttd_fps_counter = function () {
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

var _playttd_set_main_loop = function(func) {
  Module['noExitRuntime'] = true;

  var loop = FUNCTION_TABLE[func];
  var fps = new _playttd_fps_counter();

  FUNCTION_TABLE[func] = function() {
    loop();
    fps.inc();
  }
  
  var cLoop = FUNCTION_TABLE[func];
  var jsLoop = function() {
    cLoop();
    Browser.requestAnimationFrame(jsLoop);
  }

  Browser.requestAnimationFrame(jsLoop);
}