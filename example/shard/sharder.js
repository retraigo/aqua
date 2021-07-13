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
        commandPrefix: 'kuro',
        owner: '254950404050255872',
        unknownCommandResponse: false,
        apostle: [
            '679588706612805632',
            '386714563325853697',
            '462208987518205952'
        ]
    }
});

sharder.on("stats", stats => {
    console.log(stats);
  });