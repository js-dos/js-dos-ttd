// --
// -- PRE RUN 
// --

Module['preRun'].push(function() { 
    Module['playttd_prerun']();
});

// --
// -- NETWORKING
// --

_setConnected = function() {
  setTimeout(function() {Module['isConnected'] = true;}, 5000);
}

_isConnected = function() {
  return Module['isConnected'] == true;
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
    Module['dynCall']('v', func);
    // Runtime.dynCall('v', func);
    fps.inc();
  };
  
  var jsLoop = function() {
    loop();
    Browser.requestAnimationFrame(jsLoop);
  }

  Browser.requestAnimationFrame(jsLoop);
}


Module['update_fps'] = function(fps) {};

Module['playttd_prerun'] = function() {
  createMusicFiles();
};

//
// -- STARTUP SCRIPT
//

Module['getStartupScript'] = function() {
  return 'name caiiiycuk';
};

// --
// -- MUSIC MOCKS
// --

function createMusicFiles() {
  var emptyDataFile = new Uint8Array(0);
  
  Module["FS_createPath"]('/', 'home/caiiiycuk/play-ttd/etc/preload/gm', true, true);
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