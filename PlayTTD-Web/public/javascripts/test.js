Module['update_fps'] = function(fps) {
	document.getElementById('fps').innerHTML = 'FPS: ' + Math.round(fps);
};

Module['playttd_prerun'] = function() { 
  Module['UUID'] = -1;
  createMusicFiles();
  Module["FS_createPath"]('/', 'home/caiiiycuk/play-ttd/etc/preload/save', true, true);
  Module["FS_createPreloadedFile"](
  	'/home/caiiiycuk/play-ttd/etc/preload/save', 
  	'perfomacne_test.sav', 
  	'/save/perfomance_test.sav', 
  	true, true);
};

//'-d', '3'
Module['arguments'] = ['-s', 'null', '-m', 'em_midi', '-x', '-c', '/home/caiiiycuk/play-ttd/etc/preload/openttd.cfg', '-r', '1024x768', '-g', '/home/caiiiycuk/play-ttd/etc/preload/save/perfomacne_test.sav'];