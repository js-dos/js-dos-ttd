Module['update_fps'] = function() {};

Module['playttd_prerun'] = function() { 
  var width = Math.round(Module['canvas'].clientWidth);
  var height = Math.round(Module['canvas'].clientHeight);
  Module['canvas'].offsetTop = "abc";
  Module['arguments'].push('-r', width+'x'+height);
  
  Module['UUID'] = UUID;
  createMusicFiles();

  Module["FS_createPath"]
    ('/', 'home/caiiiycuk/play-ttd/etc/preload/save', true, true);

  var saves = Object.keys(Engine['saves']);
  for (var i = 0; i < saves.length; ++i) {
    var file = saves[i];
    var url = Engine['saves'][file];

  Module["FS_createPreloadedFile"]
    ('/home/caiiiycuk/play-ttd/etc/preload/save', file, url, true, true);
  }
};

//'-d', '3'
Module['arguments'] = ['-s', 'null', '-x', '-c', '/home/caiiiycuk/play-ttd/etc/preload/openttd.cfg'];
Module['arguments'] = Engine['arguments'].concat(Module['arguments']);