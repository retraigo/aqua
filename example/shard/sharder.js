const Sharder = require('../../index').Secretary.Sharder
const { Discord } = require('./config')
const sharder = new Sharder(Discord, __dirname + "/client.js", {
    stats: true,
    debug: true,
    guildsPerShard: 1500,
    name: "NekoOfTheAbyss",
    clusters: 1,

    clientOptions: {
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
    aquaOptions: {
        commandPrefix: 'kuro', // Kuroneko#5118 best bot.
        master: 'your id', //or an array of ids
        unknownCommandResponse: false,
        staff: 'staff id' // or an array of ids

    }
});

sharder.on("stats", stats => {
    console.log(stats);
});