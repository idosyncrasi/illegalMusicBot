import { getVoiceConnection } from '@discordjs/voice';
export const die = (guildId) => {
    const connection = getVoiceConnection(guildId);
    if (connection) {
        if ('subscription' in connection.state && connection.state.subscription)
            connection.state.subscription.player.stop();
        connection.destroy();
    }
    return;
};
//# sourceMappingURL=utils.js.map