import { Message } from 'discord.js';
import { joinVoiceChannel, AudioPlayerStatus } from '@discordjs/voice';
import { createAudioPlayer, createAudioResource } from '@discordjs/voice';

import ytdlp from 'yt-dlp-wrap';

export default (message: Message): any => {
	if (!message.member) return;
	const voiceChannel = message.member.voice.channel;

	if (!voiceChannel) return message.reply('Join a voice channel first idiot');
	const args = message.content.split(' ');
	if (args.length < 2) return message.reply("I... don't see a link");
	const link = args[1];
	if (!ytdl.validateURL(link)) return message.reply('Give me an actual link PLEASE');

	const connection = joinVoiceChannel({ //Create bot voice connection at this channel, https://discordjs.guide/voice/voice-connections.html, https://discordjs.github.io/voice/classes/voiceconnection.html
		channelId: voiceChannel.id,
		guildId: voiceChannel.guild.id,
		adapterCreator: voiceChannel.guild.voiceAdapterCreator,
	});

	connection.on('stateChange', (oldState, newState) => {
		console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
	});

	const stream = ytdl(link, { filter: 'audioonly' }); //Create audio stream of given link
	const player = createAudioPlayer(); // Create player, https://discordjs.guide/voice/audio-player.html, https://discordjs.github.io/voice/classes/audioplayer.html
	const resource = createAudioResource(stream);

	connection.subscribe(player);

	player.play(resource);

	player.on('stateChange', (oldState, newState) => {
		console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
	});

	player.on(AudioPlayerStatus.Idle, () => {
		
	});

	player.on('error', error => {
		console.error(`Error: ${error.message} with resource`);
		player.stop();
	});

	return voiceChannel.guild.id;
};