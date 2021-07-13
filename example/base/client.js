

const config = require("./config");
const Aqua = require('../../index')
const fs = require('fs')
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");


const client = new Aqua.AquaClient(
    config.Discord,
    {
        intents: [
            'guildMembers',
            'guilds',
            'guildMessages',
            'guildMessageReactions',
            'directMessages',
            'directMessageReactions'
        ],
        restMode: true,
        defaultImageSize: 1024,
        disableEvents: [
            'CHANNEL_CREATE',
            'CHANNEL_UPDATE',
            'CHANNEL_DELETE',
            'GUILD_BAN_ADD',
            'GUILD_BAN_REMOVE',
            'GUILD_ROLE_CREATE',
            'GUILD_ROLE_DELETE',
            'GUILD_ROLE_UPDATE',
            'MESSAGE_DELETE',
            'MESSAGE_DELETE_BULK'
        ]
    },
    {
        commandPrefix: 'kuro', // Kuroneko#5118 best bot.
        master: 'your id', //or an array of ids
        unknownCommandResponse: false,
        staff: 'staff id' // or an array of ids

    }
);

fs.readdir(__dirname + "/events/", (err, files) => {
    if(files) {
    files.forEach(file => {
        const eventHandler = require(`./events/${file}`);
        const eventName = file.split(".")[0];
        client.on(eventName, (...args) => eventHandler(client, ...args));
    });
}
});

client.setProvider(
    open({
      filename: "guilds.sqlite",
      driver: sqlite3.Database
    }).then((db) => new Aqua.SQLiteProvider(db))
  );

client.registry.registerGroups([
    ['util', 'Utilities'],
])
client.registry.registerDefaultTypes()

client.registry.registerCommandsIn(`${__dirname}/commands/`)

client.connect()

