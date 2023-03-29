import { getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';
import { die } from '../commands/utils.js';
import play, { back, listQuene, skip } from '../commands/play.js';
import { data } from '../config.js';
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
                    return;
                }
            case 'play':
                guildId = play(message);
                if (!connection || connection === undefined)
                    connection = getVoiceConnection(guildId);
                if (connection) {
                    if ('subscription' in connection.state && connection.state.subscription) {
                        player = connection.state.subscription.player;
                        if (player.state.status === AudioPlayerStatus.Idle) {
                            return message.reply('Playing: ' + message.content.split(' ')[1]);
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
                return message.reply('Skipped!');
            case 'back':
                return message.reply(back(player));
            case 'pause':
                player.pause();
                return message.reply('Paused!');
            case 'stop':
                player.stop();
                return message.reply('Stopped!');
            case 'die':
                die(guildId);
                return;
            default:
                return message.reply("Silly goose that wasn't even a command");
        }
    });
};
//# sourceMappingURL=onMessage.js.map