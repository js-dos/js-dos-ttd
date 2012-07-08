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
#endif

static FMusicDriver_EmMidi iFMusicDriver_EmMidi;

const char *MusicDriver_EmMidi::Start(const char * const *) {
	playing = false;
	return NULL;
}

void MusicDriver_EmMidi::Stop() {
	playing = false;
}

void MusicDriver_EmMidi::PlaySong(const char *filename) {
#ifdef EMSCRIPTEN
	static std::string server_prefix = "http://play-ttd.com/gm/";

	std::string file(filename);
	file = server_prefix + file.substr(file.length() - 11);

	std::string playScript("Module['PLAY_MUSIC']('");
	playScript.append(file).append("');");
	emscripten_run_script(playScript.c_str());
	playing = true;
#endif	
}

void MusicDriver_EmMidi::StopSong() {
#ifdef EMSCRIPTEN	
	emscripten_run_script("Module['STOP_MUSIC']();");
	playing = false;
#endif	
}

bool MusicDriver_EmMidi::IsSongPlaying() {
	return playing;
}

void MusicDriver_EmMidi::SetVolume(byte vol){
	DEBUG(driver, 1, "em_midi: set volume not implemented");
}

#endif /* __MORPHOS__ */
