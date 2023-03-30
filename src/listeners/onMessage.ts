import { Message } from 'discord.js';
import { getVoiceConnection, VoiceConnection, AudioPlayer } from '@discordjs/voice';

import die from '../commands/die.js'; // 'require' runs from ./commands
import play from '../commands/play.js';

// @ts-ignore
import { data } from '../config.js';
import Quene from '../quene.js';
import disconnect from '../commands/disconnect.js';

// TODO: Movable entries in quene
// TODO: Log

export const quene: Quene = new Quene;

// TODO?: Create reaciton chain from most recent song added, that allows reactions to be used instead of commands
export const emojis = {
	'thumbsup': '👍',
	'thumbsdown': '👎',
	'skip': '⏩',
	'back': '⏪',
	'shuffle': '🔀',
	'pause': '⏸️',
	'play': '▶️',
	'stop': '⏹️',
	'loop': '🔁'
};

let guildId: string;
let player: AudioPlayer;
let connection: VoiceConnection | undefined;


// TODO?: Refactor connections functions to separate file (if needed by more files)
const setConnections = (): boolean => {
	if (!connection || connection === undefined) connection = getVoiceConnection(guildId);
	if (connection) {
		if ('subscription' in connection!.state && connection!.state.subscription) {
			player = connection!.state.subscription.player;
			return true;
		} else return false;
	} else return false;
}

const checkConnections = (): boolean => {
	if (!connection || connection === undefined) return false;
	if ('subscription' in connection!.state && connection!.state.subscription) {
		if(connection!.state.subscription.player) return false;
	}
	return true;
};

const resetConnections = (): void => {
	if (checkConnections()) return;
	else setConnections(); 
};

export default async (client: any): Promise<void> => {
	client.on('messageCreate', async (message: Message) => {
		if (message.content[0] === data.prefix) message.content = message.content.slice(1);
		else return;

		console.log(message.content);

		switch (message.content.split(' ')[0]) {
			case 'ping':
				return message.reply('pong');

			case 'play':
				if (message.content === 'play') {
					resetConnections();
					player.unpause(); 
					return message.react(`${emojis.play}`);
				}

			case 'play':
				guildId = await play(message);
				return setConnections();

			case 'quene':
				return message.reply(quene.listQuene());

			case 'skip':
				quene.skip(player)
				return message.react(`${emojis.skip}`);

			case 'back':
				quene.back(player);
				return message.react(`${emojis.back}`);

			case 'shuffle':
				quene.shuffle();
				return message.react(`${emojis.shuffle}`);
			
			case 'loop':
				quene.loop();
				return message.react(`${emojis.loop}`);

			case 'pause':
				resetConnections();
				player.pause();
				return message.react(`${emojis.pause}`);

			case 'clear':
				quene.clear();
				return message.reply("Quene cleared!");

			case 'stop':
				quene.clear();
				disconnect(guildId);
				connection = undefined;
				return message.react(`${emojis.stop}`);

			case 'die':
				die(guildId);

			default:
				return message.reply("Silly goose that wasn't even a command");
		}
	});
};