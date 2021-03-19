# How to build

1. Build `host` version:
```shell
mkdir build-host
cd build-host
cmake ../OpenTTD
make openttd
```

2. Build `emscripten` version:
```shell
mkdir emscripten
cd emscripten
emcmake cmake ../OpenTTD
make
```