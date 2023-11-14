import { Client, GatewayIntentBits } from 'discord.js';

import ready from "./listeners/ready.js";
import onMessage from './listeners/onMessage.js';

import { data } from './config.js';
import Log from './log.js';

Log.init();

export const client: Client = new Client({ // Add intents, gives bot all of following permissions. See more: https://discord.com/developers/docs/topics/gateway#list-of-intents
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMessageReactions
	]
});

ready(client);

onMessage(client);

client.login(data.token);

// TODO: Replace unneeded replies with reacitons