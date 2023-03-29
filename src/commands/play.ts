import { Message, VoiceBasedChannel, VoiceChannel } from 'discord.js';
import { joinVoiceChannel, AudioPlayerStatus, getVoiceConnection, AudioResource, AudioPlayer } from '@discordjs/voice';
import { createAudioPlayer, createAudioResource } from '@discordjs/voice';

import ytdl from 'ytdl-core';

let pastQuene: string[] = [];
let quene: string[] = [];

export default (message: Message): any => {
	if (!message.member) return;
	const voiceChannel = message.member.voice.channel;

	if (!voiceChannel) return message.reply('Join a voice channel first idiot');
	const args = message.content.split(' ');
	if (args.length < 2) return message.reply("I... don't see a link");
	const link = args[1];
	if (!ytdl.validateURL(link)) return message.reply('Give me an actual link PLEASE');

	if (getVoiceConnection(voiceChannel.guild.id)) {
		return oldConneciton(message, link);
	} else {
		return newConneciton(message, voiceChannel, link);
	}
	
};

export const skip = (player: AudioPlayer): string => {
	player.stop();
	const resource = playNext(player);
	if (resource) {
		player.play(resource);
		return 'Skipped!';
	} else {
		return '';
	}
}

export const back = (player: AudioPlayer): string => {
	player.stop();
	const resource = playLast(player);
	player.play(resource);
	return "Playing last song...";
}

export const listQuene = (): string => {
	let toWrite: string = '';
	for(let i = 1; i < quene.length + 1; i++) {
		toWrite += `${i}) ${quene[i - 1]}\n`;
	}
	return toWrite;
}

const getSong = (link: string): AudioResource => {
	const stream = ytdl(link, { filter: 'audioonly', dlChunkSize: 4096 });
	const resource = createAudioResource(stream);
	return resource;
}

const playLast = (player: AudioPlayer) => {
	const link = pastQuene[1];
	const resource = getSong(link);
	return resource;
}

const playNext = (player: AudioPlayer) => {
	if (quene.length > 0) {
		const link = quene[0];
		pastQuene.unshift(link);
		quene.shift();
		const resource = getSong(link);
		return resource;
	} else {
		player.stop();
	}
}

const oldConneciton = (message: Message, link: string): any => {
	quene.push(link);
	return message.reply(`${link} added to quene!`);
}

const newConneciton = (message: Message, voiceChannel: VoiceChannel | VoiceBasedChannel, link: string): any => {
	pastQuene.push(link);
	const connection = joinVoiceChannel({ //Create bot voice connection at this channel, https://discordjs.guide/voice/voice-connections.html, https://discordjs.github.io/voice/classes/voiceconnection.html
		channelId: voiceChannel.id,
		guildId: voiceChannel.guild.id,
		adapterCreator: voiceChannel.guild.voiceAdapterCreator,
	});

	connection.on('stateChange', (oldState, newState) => {
		console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
	});

	const player = createAudioPlayer(); // Create player, https://discordjs.guide/voice/audio-player.html, https://discordjs.github.io/voice/classes/audioplayer.html
	const resource = getSong(link);

	connection.subscribe(player);

	player.play(resource);

	player.on('stateChange', (oldState, newState) => {
		console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
	});

	player.on(AudioPlayerStatus.Idle, () => {
		const res = playNext(player);
		if (res) {
			player.play(res);
		} else {
			return message.reply("Quene has ended");
		}
	});

	player.on('error', error => {
		console.error(`Error: ${error.message} with resource`);
		const res = playNext(player);
		if (res) {
			player.play(res);
		} else {
			return message.reply("Quene has ended");
		}
	});

	return voiceChannel.guild.id;
}