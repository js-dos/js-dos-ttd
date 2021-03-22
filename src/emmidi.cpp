//
// Created by caiiiycuk on 22.03.2021.
//
#include "stdafx.h"
#include "music/extmidi.h"
#include "base_media_base.h"

static FMusicDriver_ExtMidi iFMusicDriver_ExtMidi;

#ifdef EMSCRIPTEN
#include <emscripten.h>
EM_JS(void, start, (), {
    Module.audio = document.createElement("audio");
    Module.audio.setAttribute("autoplay", "true");

    var fixSounds = function(event) {
        if (Module.audio.src !== "" && Module.audio.paused) {
            Module.audio.play();
        }
    };

    var bindOptions = {
        capture: true,
        passive: true,
    };
    window.addEventListener("touchstart", fixSounds, bindOptions);
    window.addEventListener("mousedown", fixSounds, bindOptions);
});

EM_JS(void, stop, (), {
    Module.audio.src = "";
});

EM_JS(void, play, (const char* ptr), {
    var file = UTF8ToString(ptr);
    var idx = file.indexOf("/");
    Module.audio.src = "async/open_msx/" + file.substr(idx + 1).replace(".mid", ".mp3");
});

EM_JS(bool, isPlaying, (), {
    return Module.audio.src !== "" && !Module.audio.paused;
});

EM_JS(void, setVolume, (double volume), {
    Module.audio.volume = Math.min(1, volume);
});
#endif

const char *MusicDriver_ExtMidi::Start(const StringList &parm) {
#ifdef EMSCRIPTEN
    start();
#endif
    return nullptr;
}

void MusicDriver_ExtMidi::Stop() {
#ifdef EMSCRIPTEN
    stop();
#endif
}

void MusicDriver_ExtMidi::PlaySong(const MusicSongInfo &song) {
#ifdef EMSCRIPTEN
    play(song.filename);
#endif
}

void MusicDriver_ExtMidi::StopSong() {
#ifdef EMSCRIPTEN
    stop();
#endif
}

bool MusicDriver_ExtMidi::IsSongPlaying() {
#ifdef EMSCRIPTEN
    return isPlaying();
#endif
    return false;
}

void MusicDriver_ExtMidi::SetVolume(byte vol) {
#ifdef EMSCRIPTEN
    setVolume(vol / 128.0);
#endif
}
