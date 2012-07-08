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


static FMusicDriver_EmMidi iFMusicDriver_EmMidi;

const char *MusicDriver_EmMidi::Start(const char * const *) {
	Mix_OpenAudio(44100, AUDIO_S16SYS, 2, 1024);
	playing = false;

	return NULL;
}

void MusicDriver_EmMidi::Stop() {
	playing = false;
}

void MusicDriver_EmMidi::PlaySong(const char *filename) {
	static std::string server_prefix = "http://play-ttd.com/gm/";

	std::string file(filename);
	//GM_TT00.OGG == 11
	file = server_prefix + file.substr(file.length() - 11);
	DEBUG(driver, 1, "play %s", file.c_str());

	Mix_Music* music = 0;

	std::map<std::string, Mix_Music*>::iterator i = loaded.find(file);

	if (i != loaded.end()) {
		music = i->second;
	} else {
		music = Mix_LoadMUS(file.c_str());
		loaded.insert(std::make_pair(file, music));
	}

	Mix_HaltMusic();
	Mix_PlayMusic(music, 1);
	playing = true;
}

void MusicDriver_EmMidi::StopSong() {
	Mix_HaltMusic();
	playing = false;
}

bool MusicDriver_EmMidi::IsSongPlaying() {
	return playing;
}

void MusicDriver_EmMidi::SetVolume(byte vol){
	DEBUG(driver, 1, "em_midi: set volume not implemented");
}

#endif /* __MORPHOS__ */
