const { Command } = require("../../../../index");

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			group: 'util',
			memberName: 'ping',
			userPermissions: ["sendMessages"],
			description: 'Check the client\'s ping to the Server.',
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}
	async run(message) {
		const msg = await message.reply("Lemme check the ping brb")
		return msg.edit(`Tis an insignificant number, ${(msg.editedTimestamp || msg.createdAt) - (message.editedTimestamp || message.createdAt)}ms.`);
	}
};


