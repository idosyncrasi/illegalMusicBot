import { AudioResource, createAudioResource } from "@discordjs/voice";
import ytdl from "ytdl-core";

// BUG: Slight audio glitches 
export const getSong = (link: string): AudioResource => { // Returns audio stream for given url
	const stream = ytdl(link, { filter: 'audioonly', dlChunkSize: 4096 }); // https://github.com/fent/node-ytdl-core/blob/master/README.md
	return createAudioResource(stream);
};

export const currDate = class {
	static date: Date = new Date;

	static currDate = (safeFormat?: boolean): string => {
		if (safeFormat) return `${this.date.getMonth()+1}-${this.date.getDate()}-${this.date.getFullYear()}`;
		return `${this.date.getMonth()+1}/${this.date.getDate()}/${this.date.getFullYear()}`;
	};

	static currTimeShort = (safeFormat?: boolean): string => {
		if (safeFormat) return  `${this.date.getHours()}${this.date.getMinutes()}`;
		return `${this.date.getHours()}:${this.date.getMinutes()}`;
	};

	static currTimeLong = (safeFormat?: boolean): string => {
		if (safeFormat) return `${this.date.getHours()}${this.date.getMinutes()}${this.date.getMilliseconds()}`;
		return `${this.date.getHours()}:${this.date.getMinutes()}:${this.date.getMilliseconds()}`;
	};
}