const { Command } = require("../../../../index");
const { resolveColor, resolveString } = require("../../../../src/util")
const { stripIndents, oneLine } = require('common-tags');


module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            group: 'util',
            memberName: 'help',
            aliases: ['commands'],
            description: 'Displays a list of available commands, or detailed information for a specified command.',
            examples: ['help', 'help prefix'],
            guarded: true,

            args: [
                {
                    key: 'command',
                    prompt: 'Command to get info on?',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }


    async run(message, args) { // eslint-disable-line complexity
        const prefix = message.guild ? message.guild.commandPrefix : this.client.commandPrefix;
        console.log(message.guild.name)
        const helpEmbed = {type: 'rich'}
        helpEmbed.title = "Example help command"
        helpEmbed.description = ""
        helpEmbed.thumbnail = { url: this.client.user.displayAvatarURL() }
        helpEmbed.color = resolveColor("#e0e0e0")
        const groups = this.client.registry.groups;
        const commands = this.client.registry.findCommands(args.command, false, message);
        const showAll = args.command && args.command.toLowerCase() === 'all';

        if (args.command && !showAll) {

            if (commands.length === 1) {
                helpEmbed.title = `Info on ${commands[0].name}`

                let helpthing = stripIndents`
					${oneLine`
						${commands[0].description}
						${commands[0].guildOnly ? ' This command can only be used in a server' : 'This command can also be used in DMs'}
						${commands[0].nsfw ? ' in nsfw channels only.' : 'in any text channel.'}
					`}
					**Format:** ${message.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`)}
				`;
                if (commands[0].aliases.length > 0) helpthing += `\n**Aliases:** ${commands[0].aliases.join(', ')}`;

                if (commands[0].details) helpthing += `\n**Info:** ${commands[0].details}`;

                helpEmbed.description = resolveString(helpthing)

 
                const messages = [];
                try {
                    console.log(helpEmbed)
                    message.channel.send({ embed: helpEmbed })
                } catch (err) {
                    client.postError(err)
                    messages.push(await message.reply('I couldn\'t send the help message in that channel!'));
                }
                return messages;
            } else if (commands.length > 15) {
                return message.reply('Too many commands matched. Maybe be more specific?');
            } else if (commands.length > 1) {
                return message.reply("I have found more than one command to match your query and thats bad. Be a bit more specific.");
            } else {
                return message.reply(
                    `Couldn't find a match. Use ${message.usage(
                        null, message.channel.type === 'dm' ? null : undefined, message.channel.type === 'dm' ? null : undefined
                    )} to view the list of all commands (its worth more than looking for wrong commands trust me).`
                );

                function disambiguation(items, label, property = 'name') {
                    const itemList = items.map(item => `"${(property ? item[property] : item).replace(/ /g, '\xa0')}"`).join(',   ');
                    return `Multiple ${label} found, please be more specific: ${itemList}`;
                }

            }
        }
        else {





            var resultGroups = []
            var resultCommands = []
            let helpStuff = "Below are a list of available commands!"

            groups.filter(grp => grp.commands.some(cmd => !cmd.hidden && (showAll || cmd.isUsable(message))))
                .map(grp => {
                    resultGroups.push(grp.name)
                    resultCommands.push(grp.commands.filter(cmd => !cmd.hidden && (showAll || cmd.isUsable(message)))
                        .map(cmd => "`" + cmd.name + "`").join(', '))

                })

            helpEmbed.description = helpStuff
            helpEmbed.footer = { text: "For more info on a command, use `" + prefix + " help [command]" }
            let i = 0
            helpEmbed.fields = []
            while (i < resultGroups.length) {

                helpEmbed.fields.push({ name: resultGroups[i], value: resultCommands[i], inline: true })
                i += 1

            }










            message.channel.send(helpEmbed)
        }
    }
}
