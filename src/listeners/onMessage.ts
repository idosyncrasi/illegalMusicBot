import { Message } from 'discord.js';
import { getVoiceConnection, VoiceConnection, AudioPlayer } from '@discordjs/voice';

import die from '../commands/die.js'; // 'require' runs from ./commands
import play from '../commands/play.js';

// @ts-ignore
import { data } from '../config.js';
import Quene from '../quene.js';
import disconnect from '../commands/disconnect.js';
import Log from '../log.js';

// TODO: Movable entries in quene
// TODO: Log

export const quene: Quene = new Quene;

// TODO?: Create reaciton chain from most recent song added, that allows reactions to be used instead of commands
const emojis = {
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
const setConnections = (): boolean => { // Define global connections
	if (!connection || connection === undefined) {
		connection = getVoiceConnection(guildId);
		Log.write(`Set global AudioConnection at guildId: ${guildId}`);
	}

	if (connection) {
		if ('subscription' in connection!.state && connection!.state.subscription) {
			player = connection!.state.subscription.player;
			Log.write(`Set global AudioPlayer at guildId: ${guildId}`);
			return true;
		} else return false;

	} else return false;
}

const checkConnections = (): boolean => { // Check if connections are still correct
	if (!connection || connection === undefined) return false;

	if ('subscription' in connection!.state && connection!.state.subscription) {
		if(connection!.state.subscription.player) return false;
	}
	return true;
};

const resetConnections = (): void => { // Reset all connections
	if (checkConnections()) return;
	else {
		setConnections(); 
		Log.write('Resetting connections...');
	}
};

export default async (client: any): Promise<void> => {
	client.on('messageCreate', async (message: Message) => {
		if (message.content[0] === data.prefix) message.content = message.content.slice(1); // Remove prefix
		else return;
		
		Log.write(`Command: ${message.content}`);
		Log.write(`Guild: ${message.guild?.name}`);
		Log.write(`Channel: ${message.channelId}`);
		Log.write(`Author: ${message.author}`);
		console.log(message.content);

		switch (message.content.split(' ')[0]) {
			case 'ping':
				Log.write('Replied: pong');
				return message.reply('pong');

			case 'play':
				if (message.content === 'play') {
					resetConnections();
					player.unpause(); 
					Log.write('Replied: play reaction');
					return message.react(`${emojis.play}`);
				}

			case 'play':
				guildId = await play(message);
				message.react(`${emojis.play}`);
				Log.write('Replied: play reaction');
				return setConnections();

			case 'playing':
				Log.write(`Replied: ${quene.previous[0]}`);
				return message.reply(quene.previous[0]);

			case 'playnext':
				quene.next.unshift(message.content.split(' ')[1]);
				Log.write('Replied: play reaction');
				return message.react(`${emojis.play}`);

			case 'quene':
				Log.write(`Replied: ${quene.listQuene()}`);
				return message.reply(quene.listQuene());

			case 'skip':
				quene.skip(player);
				Log.write('Replied: skip reaction');
				return message.react(`${emojis.skip}`);

			case 'back':
				quene.back(player);
				Log.write('Replied: back reaction');
				return message.react(`${emojis.back}`);

			case 'shuffle':
				quene.shuffle();
				Log.write('Replied: shuffle reaction');
				return message.react(`${emojis.shuffle}`);
			
			case 'loop':
				quene.loop();
				Log.write('Replied: loop reaction');
				return message.react(`${emojis.loop}`);

			case 'pause':
				resetConnections();
				player.pause();
				Log.write('Replied: pause reaction');
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