import { Client, GatewayIntentBits } from 'discord.js';
import ready from "./listeners/ready.js";
import onMessage from './listeners/onMessage.js';
import { data } from './config.js';
export const client = new Client({
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
//# sourceMappingURL=bot.js.map