import { getVoiceConnection } from '@discordjs/voice';
import { client } from '../bot.js';
export const die = (guildId) => {
    const connection = getVoiceConnection(guildId);
    if ('subscription' in connection.state && connection.state.subscription)
        connection.state.subscription.player.stop();
    connection.destroy();
    client.destroy();
    return;
};
//# sourceMappingURL=utils.js.map