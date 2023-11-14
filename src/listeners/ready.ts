import { Client } from "discord.js";
import Log from '../log.js';

export default (client: Client): void => {
	client.on("ready", async () => {
		if (!client.user || !client.application) return;
		console.log(`${client.user.username} is online`);
		Log.write("Client readyed");
	});
};