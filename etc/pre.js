Module['preRun'] = function() { 
	SDL.defaults.copyOnLock = false 
};

Module['arguments'] = ['-d', '3', '-s', 'null', '-m', 'null', '-x', '-c', '/home/caiiiycuk/play-ttd/etc/preload/openttd.cfg'];

Module['print'] = function(text) {
	console.log(text);
};