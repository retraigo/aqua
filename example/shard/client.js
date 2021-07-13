const fs = require('fs')
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const Aqua = require('../../index')

const Base = require('../../index').Secretary.Base;
class Class extends Base{
    constructor(bot) {
        super(bot);
    }

    
    launch() {

const client = this.bot
console.log(client.commandPrefix)
fs.readdir(__dirname + "/events/", (err, files) => {
    if(files) {
    files.forEach(file => {
        const eventHandler = require(`./events/${file}`);
        console.log(typeof eventHandler)
        const eventName = file.split(".")[0];
        console.log(eventName)
        client.on(eventName, (...args) => {
            console.error(eventName)
            eventHandler(client, ...args)
        });
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
    }

}

module.exports = Class;

