import { Client, GatewayIntentBits } from 'discord.js';

import ready from "./listeners/ready.js";
import onMessage from './listeners/onMessage.js';

// @ts-ignore
import { data } from './config.js';

export const client: Client = new Client({ // Add intents, gives bot all of following permissions. See more: https://discord.com/developers/docs/topics/gateway#list-of-intents
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages
	]
});

ready(client);

onMessage(client);

client.login(data.token);

/*
	TODO: Add a quene (movable entries)
	TODO: Add other website support/not only single youtube video
	TODO: Skip songs
	TODO: shuffle
	TODO: loop
*/