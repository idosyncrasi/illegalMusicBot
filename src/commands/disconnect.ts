import { getVoiceConnection } from '@discordjs/voice';
import { client } from '../bot.js';

export default (guildId: string): boolean => {
	const connection = getVoiceConnection(guildId);
	if (connection) {
		if ('subscription' in connection!.state && connection!.state.subscription) connection!.state.subscription.player.stop();
		connection!.destroy();
	}
    return true; // TODO: Add check to tell user if all connections destroyed successfully
};