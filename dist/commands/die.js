import { getVoiceConnection } from '@discordjs/voice';
import { client } from '../bot.js';
export default (guildId) => {
    const connection = getVoiceConnection(guildId);
    if (connection) {
        if ('subscription' in connection.state && connection.state.subscription)
            connection.state.subscription.player.stop();
        connection.destroy();
    }
    client.destroy();
    return;
};
//# sourceMappingURL=die.js.map