import { AudioPlayer, AudioResource } from "@discordjs/voice";
import { getSong } from "./commands/play.js";

export default class Quene {

	'next': string[];
	'previous': string[];

	constructor() {
		this.next = [];
		this.previous= [];
	}

	skip = (player: AudioPlayer): void => {
		player.stop();
		const resource = this.playNext(player);
		if (resource) player.play(resource);
		return;
	};

	back = (player: AudioPlayer): string => {
		player.stop();
		const resource = this.playLast();
		player.play(resource);
		return "Playing last song...";
	};

	shuffle = () => {
		// Stolen with care from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

		let currentIndex = this.next.length,  randomIndex;
		
		// While there remain elements to shuffle.
		while (currentIndex !== 0) {
		
			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
		
			// And swap it with the current element.
			[this.next[currentIndex], this.next[randomIndex]] = [
			this.next[randomIndex], this.next[currentIndex]];
		}
		
		return this.next;
	};

	playNext = (player: AudioPlayer): AudioResource | void => {
		if (this.next.length > 0) {
			const link = this.next[0];
			this.previous.unshift(link);
			this.next.shift();
			return getSong(link);
		} else player.stop();
	};

	playLast = () => {
		const link = this.previous[1];
		this.next.unshift(this.previous[0]);
		this.previous.shift();
		return getSong(link);
	};

	listQuene = (): string => {
		let toWrite: string = '';
		for (let i = 1; i < this.next.length + 1; i++) toWrite += `${i}) ${this.next[i - 1]}\n`;
		return toWrite;
	};

	clear = () => {
		this.next = [];
	}
};