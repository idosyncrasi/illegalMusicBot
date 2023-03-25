import { Message } from 'discord.js';
import { getVoiceConnection, VoiceConnection } from '@discordjs/voice';

import { die } from '../commands/utils.js'; // 'require' runs from ./commands
import play from '../commands/play.js';
import addSong from '../commands/addSong.js'

// @ts-ignore
import { data } from '../config.js';


let guildId: string;
let player: { unpause: () => void; pause: () => void; stop: () => void; };
let connection: VoiceConnection | undefined;

export default async (client: any): Promise<void> => {
	client.on('messageCreate', (message: Message) => {
		if (message.content[0] === data.prefix) { message.content = message.content.slice(1); } else { return; }
		console.log(message.content);

		switch (message.content.split(' ')[0]) {
			case 'ping':
				return message.reply('pong');

			case 'play':
				if (message.content === 'play') {
					player.unpause(); return;
				}

			case 'play':
				guildId = play(message);
				if (!connection || connection === undefined) connection = getVoiceConnection(guildId);

				if (connection !== undefined) {
					if ('subscription' in connection!.state && connection!.state.subscription) {
						player = connection!.state.subscription.player;
						return message.reply('Playing: ' + message.content.split(' ')[1]);
					} else {
						return message.reply('Something went wrong, please try again after going to fuck yourself.');
					}
				} else {
					return message.reply('Something went wrong, please try again after going to fuck yourself.');
				}

			case 'pause':
				player.pause();
				return message.reply('Paused!');

			case 'stop':
				player.stop();
				return message.reply('Stopped!');

			case 'add':
				addSong(guildId);

			case 'die':
				console.log("Ran die");
				die(guildId);

			default:
				return message.reply("Silly goose that wasn't even a command");
		}

		
	});
};