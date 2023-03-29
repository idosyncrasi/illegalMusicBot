import { Message, VoiceBasedChannel, VoiceChannel } from 'discord.js';
import { joinVoiceChannel, AudioPlayerStatus, getVoiceConnection, AudioResource, AudioPlayer } from '@discordjs/voice';
import { createAudioPlayer, createAudioResource } from '@discordjs/voice';

import ytdl from 'ytdl-core';

import { quene } from 'src/listeners/onMessage.js';


// TODO: Movable entries in quene
// TODO: Shuffle
// TODO: Loop
// TODO: Log

export default (message: Message): any => {
	if (!message.member) return;
	const voiceChannel = message.member.voice.channel;

	if (!voiceChannel) return message.reply('Join a voice channel first idiot');
	const args = message.content.split(' ');
	if (args.length < 2) return message.reply("I... don't see a link");
	const link = args[1];
	if (!ytdl.validateURL(link)) return message.reply('Give me an actual link PLEASE');

	if (getVoiceConnection(voiceChannel.guild.id)) {
		return oldConneciton(message, voiceChannel, link);
	} else {
		return newConneciton(message, voiceChannel, link);
	}

};

// BUG: Slight audio glitches 
export const getSong = (link: string): AudioResource => {
	const stream = ytdl(link, { filter: 'audioonly', dlChunkSize: 4096 });
	return createAudioResource(stream);
};

const oldConneciton = (message: Message, voiceChannel: VoiceChannel | VoiceBasedChannel, link: string): any => {
	const connection = getVoiceConnection(voiceChannel.guild.id);
	let player: AudioPlayer | null;
	if ('subscription' in connection!.state && connection!.state.subscription) {
		player = connection!.state.subscription.player;
	} else player = null;
	console.log();
	if (player && quene.next.length === 0 && player.state.status === AudioPlayerStatus.Idle) {
		quene.next.push(link);
		const resource = quene.playNext(player);
		if (resource) player.play(resource);
	} else {
		quene.next.push(link);
		return message.reply(`${link} added to quene!`);
	}
};

const newConneciton = (message: Message, voiceChannel: VoiceChannel | VoiceBasedChannel, link: string): any => {
	
	quene.previous.push(link);
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
		const res = quene.playNext(player);
		if (res) player.play(res);
		else return message.reply("Quene has ended");
	});

	player.on('error', error => {
		console.error(`Error: ${error.message} with resource`);
		const res = quene.playNext(player);
		if (res) player.play(res); else return message.reply("Quene has ended");
	});

	return voiceChannel.guild.id;
};