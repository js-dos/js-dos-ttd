**The project is archived. 
Nowdays orignal game works fine in js-dos https://dos.zone/transport-tycoon-deluxe-1995/ and OpenTTD itself have a support for emscripten.**

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
