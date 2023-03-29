import { Message } from 'discord.js';
import { getVoiceConnection, VoiceConnection, AudioPlayer, AudioPlayerStatus, VoiceConnectionStatus } from '@discordjs/voice';

import die from '../commands/die.js'; // 'require' runs from ./commands
import play, { back, listQuene, skip } from '../commands/play.js';

// @ts-ignore
import { data } from '../config.js';

// TODO: Create reaciton chain from most recent song added, that allows reactions to be used instead of commands
export const emojis = {
	'thumbsup': '👍',
	'thumbsdown': '👎',
	'skip': '⏩',
	'back': '⏪',
	'pause': '⏸️',
	'play': '▶️',
	'stop': '⏹️'
};

let guildId: string;
let player: AudioPlayer;
let connection: VoiceConnection | undefined;

const setConnections = (message: Message): boolean => {
	if (!connection || connection === undefined) connection = getVoiceConnection(guildId);
	if (connection) {
		if ('subscription' in connection!.state && connection!.state.subscription) {
			player = connection!.state.subscription.player;
			return true;
		} else { return false; }
	} else { return false; }
}

export default async (client: any): Promise<void> => {
	client.on('messageCreate', (message: Message) => {
		if (message.content[0] === data.prefix) { message.content = message.content.slice(1); }
		else { return; }

		console.log(message.content);

		switch (message.content.split(' ')[0]) {
			case 'ping':
				return message.reply('pong');

			case 'play':
				if (message.content === 'play') {
					player.unpause();
					return message.react(emojis.play);
				}

			case 'play':
				guildId = play(message);
				setConnections(message);

			case 'quene':
				return message.reply(listQuene());

			case 'skip':
				skip(player)
				return message.react(`${emojis.skip}`);

			case 'back':
				back(player);
				return message.react(`${emojis.back}`);

			case 'pause':
				player.pause();
				return message.react(`${emojis.pause}`);

			case 'stop':
				player.stop();
				return message.react(`${emojis.stop}`);

			case 'die': // BUG: Die stopped working for some reason
				die(guildId);
				return;

			default:
				return message.reply("Silly goose that wasn't even a command");
		}
	});
};