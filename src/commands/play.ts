import { Message, VoiceBasedChannel, VoiceChannel } from 'discord.js';
import { joinVoiceChannel, AudioPlayerStatus, getVoiceConnection, AudioResource, AudioPlayer } from '@discordjs/voice';
import { createAudioPlayer, createAudioResource } from '@discordjs/voice';

import ytdl from 'ytdl-core';
import ytpl from 'ytpl';
import spdl from 'spottydl';

import { quene } from '../listeners/onMessage.js';



export default async (message: Message): Promise<any> => { // Run url checks and pick connection function depending on whether a connection already exists
	if (!message.member) return;
	const voiceChannel = message.member.voice.channel;

	if (!voiceChannel) return message.reply('Join a voice channel first idiot');
	const args = message.content.split(' ');
	if (args.length < 2) return message.reply("I... don't see a link");
	let link: string | Promise<string> = args[1];

	console.log(spdl.getTrack("https://music.youtube.com/watch?v=r_IDrSuJV08&feature=share"));

	if (ytpl.validateID(link)) link = await getPlaylist(link);
	else if (!ytdl.validateURL(link)) return message.reply('Give me an actual link PLEASE');

	if (getVoiceConnection(voiceChannel.guild.id)) {
		return oldConneciton(message, voiceChannel, link); // Connection already exists
	} else {
		return newConneciton(message, voiceChannel, link); // Connection does not exist
	}

};

// BUG: Slight audio glitches 
export const getSong = (link: string): AudioResource => { // Returns audio stream for given url
	const stream = ytdl(link, { filter: 'audioonly', dlChunkSize: 4096 }); // https://github.com/fent/node-ytdl-core/blob/master/README.md
	return createAudioResource(stream);
};

const getPlaylist = async (link: string): Promise<string> => {
	const toPlay: Promise<string> = ytpl(link).then( (playlist: any) => {
		const songs: string[] = [];

		for (let i = 0; i < playlist.estimatedItemCount; i++){ // Loops through items given by ytpl and adds their urls to array
			if(!playlist.items[i]) console.log(`Index ${i} in playlist.items had an error`);
			else if (playlist.items[i].isPlayable) songs.push(playlist.items[i].shortUrl);
		}

		const song = songs[0]; // Save to play first song of playlist
		songs.shift();

		for (let i = 0; i < songs.length; i++) { // Pushes rest of playlist to quene
			quene.next.push(songs[i]);
		}

		return song;
	});
	return toPlay;
};

const oldConneciton = (message: Message, voiceChannel: VoiceChannel | VoiceBasedChannel, link: string): any => { // Runs if connection already exists
	const connection = getVoiceConnection(voiceChannel.guild.id);
	let player: AudioPlayer | null;

	if ('subscription' in connection!.state && connection!.state.subscription) {
		player = connection!.state.subscription.player;
	} else player = null;

	if (player && quene.next.length === 0 && player.state.status === AudioPlayerStatus.Idle) { // If bot is not playing, but in channel, play given url
		quene.next.push(link);
		const resource = quene.playNext(player);
		if (resource) player.play(resource);
	} else { // If bot is currently playing, add url to quene
		quene.next.push(link);
		return message.reply(`${link} added to quene!`);
	}
};

const newConneciton = (message: Message, voiceChannel: VoiceChannel | VoiceBasedChannel, link: string): string => { // Runs if connection does not exist
	
	quene.previous.push(link); // Add new link to previous (index 0 of previous is always currently playing song)
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

	player.on('stateChange', (oldState, newState) => { // Log state changes
		console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
	});

	player.on(AudioPlayerStatus.Idle, () => { // If there are more songs in quene, play them
		const res = quene.playNext(player);
		if (res) player.play(res);
		else return message.reply("Quene has ended");
	});

	player.on('error', error => { // Log errors in AudioPlayer
		console.error(`Error: ${error.message} with resource`);
		const res = quene.playNext(player);
		if (res) player.play(res); else return message.reply("Quene has ended");
	});

	return voiceChannel.guild.id;
};