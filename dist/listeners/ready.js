export default (client) => {
    client.on("ready", async () => {
        if (!client.user || !client.application)
            return;
        console.log(`${client.user.username} is online`);
    });
};
//# sourceMappingURL=ready.js.map