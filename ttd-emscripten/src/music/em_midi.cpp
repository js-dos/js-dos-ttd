#ifndef __MORPHOS__

#include "../stdafx.h"
#include "../debug.h"
#include "../string_func.h"
#include "../sound/sound_driver.hpp"
#include "../video/video_driver.hpp"
#include "../gfx_func.h"
#include <fcntl.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <signal.h>
#include <sys/stat.h>
#include <errno.h>

#include "em_midi.h"

#ifdef EMSCRIPTEN
#include <emscripten.h>

extern "C" {
extern void em_midi_volume(byte);
extern void em_midi_play(const char*);
extern bool em_midi_is_playing();
extern void	em_midi_stop();
}

#endif

static FMusicDriver_EmMidi iFMusicDriver_EmMidi;

const char *MusicDriver_EmMidi::Start(const char * const *) {
	return NULL;
}

void MusicDriver_EmMidi::Stop() {
}

void MusicDriver_EmMidi::PlaySong(const char *filename) {
#ifdef EMSCRIPTEN
	em_midi_play(filename);
#endif	
}

void MusicDriver_EmMidi::StopSong() {
#ifdef EMSCRIPTEN	
	em_midi_stop();
#endif	
}

bool MusicDriver_EmMidi::IsSongPlaying() {
#ifdef EMSCRIPTEN	
	return em_midi_is_playing();
#endif	

	return false;
}

void MusicDriver_EmMidi::SetVolume(byte vol){
#ifdef EMSCRIPTEN	
	em_midi_volume(vol);
#endif
}

#endif /* __MORPHOS__ */
