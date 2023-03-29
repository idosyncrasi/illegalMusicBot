import { getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';
import die from '../commands/die.js';
import play, { back, listQuene, skip } from '../commands/play.js';
import { data } from '../config.js';
export const emojis = {
    'thumbsup': '👍',
    'thumbsdown': '👎',
    'skip': '⏩',
    'back': '⏪',
    'pause': '⏸️',
    'play': '▶️',
    'stop': '⏹️'
};
let guildId;
let player;
let connection;
export default async (client) => {
    client.on('messageCreate', (message) => {
        if (message.content[0] === data.prefix) {
            message.content = message.content.slice(1);
        }
        else {
            return;
        }
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
                if (!connection || connection === undefined)
                    connection = getVoiceConnection(guildId);
                if (connection) {
                    if ('subscription' in connection.state && connection.state.subscription) {
                        player = connection.state.subscription.player;
                        if (player.state.status === AudioPlayerStatus.Idle) {
                            console.log(`${emojis.thumbsup}`);
                            return message.react(`${emojis.play}`);
                        }
                        else {
                            return;
                        }
                    }
                    else {
                        return message.reply('Something went wrong, please try again after going to fuck yourself.');
                    }
                }
                else {
                    return message.reply('Something went wrong, please try again after going to fuck yourself.');
                }
            case 'quene':
                return message.reply(listQuene());
            case 'skip':
                skip(player);
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
            case 'die':
                die(guildId);
                return;
            default:
                return message.reply("Silly goose that wasn't even a command");
        }
    });
};
//# sourceMappingURL=onMessage.js.map