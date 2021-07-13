# Aqua
A command handler built on top of Eris inspired by discord.js-commando.

**I do not own most of the code in this repo. I simply compiled code from `eris-sharder`, `eris-additions` and `discord.js-commando` into one big package while also porting commando's use for Eris.**

## Example

```javascript



const Aqua = require('this repo')
const fs = require('fs')
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");


const client = new Aqua.AquaClient(
    process.env.token,
    {
        restMode: true,
    },
    {
        commandPrefix: 'kuro', // Kuroneko#5118 best bot.
        master: 'your id', //or an array of ids
        unknownCommandResponse: false,
        staff: 'staff id' // or an array of ids

    }
);


client.setProvider(
    open({
      filename: "guilds.sqlite",
      driver: sqlite3.Database
    }).then((db) => new Aqua.SQLiteProvider(db))
  );

client.registry.registerGroups([
    ['util', 'Utilities'],
])

// not all types from commando are available yet
client.registry.registerDefaultTypes()

// register your commands
client.registry.registerCommandsIn(`${__dirname}/commands/`)

client.connect()


```

This repo did not work with `eris-sharder` and thus, I tweaked it a bit to work. Along with the default options, I added a new `aquaOptions` option which can be modified for use with the AquaClient.

```javascript
const { Secretary } = require('this repo')
 
new Secretary.Sharder(Discord, __dirname + "/client.js", {
    stats: true,
    debug: true,
    guildsPerShard: 1500,
    name: "NekoOfTheAbyss",
    clusters: 1,
    clientOptions: {
        restMode: true,
    },
    aquaOptions: {
        commandPrefix: 'kuro', // Kuroneko#5118 still best bot.
        master: 'your id', //or an array of ids
        unknownCommandResponse: false,
        staff: 'staff id' // or an array of ids
    }
});

```
