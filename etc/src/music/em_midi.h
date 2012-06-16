/* $Id: extmidi.h 17875 2009-10-25 21:47:32Z smatz $ */

/*
 * This file is part of OpenTTD.
 * OpenTTD is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, version 2.
 * OpenTTD is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with OpenTTD. If not, see <http://www.gnu.org/licenses/>.
 */

/** @file extmidi.h Base support for playing music via an external application. */

#ifndef MUSIC_EMSCRIPTEN_H
#define MUSIC_EMSCRIPTEN_H

#include "music_driver.hpp"

#include <SDL/SDL_mixer.h>
#include <map>
#include <string>


class MusicDriver_EmMidi: public MusicDriver {
private:
	std::map<std::string, Mix_Music*> loaded;
	bool		playing;

public:
	/* virtual */ const char *Start(const char * const *param);

	/* virtual */ void Stop();

	/* virtual */ void PlaySong(const char *filename);

	/* virtual */ void StopSong();

	/* virtual */ bool IsSongPlaying();

	/* virtual */ void SetVolume(byte vol);
	/* virtual */ const char *GetName() const { return "em_midi"; }
};

class FMusicDriver_EmMidi: public MusicDriverFactory<FMusicDriver_EmMidi> {
public:
	static const int priority = 3;
	/* virtual */ const char *GetName() { return "em_midi"; }
	/* virtual */ const char *GetDescription() { return "Emscripten MIDI Driver"; }
	/* virtual */ Driver *CreateInstance() { return new MusicDriver_EmMidi(); }
};

#endif /* MUSIC_EMSCRIPTEN_H */
