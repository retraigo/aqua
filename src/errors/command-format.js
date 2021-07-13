const FriendlyError = require('./friendly');

/**
 * Has a descriptive message for a command not having proper format
 * @extends {FriendlyError}
 */
class CommandFormatError extends FriendlyError {
	/**
	 * @param {Message} msg - The command message the error is for
	 */
	constructor(msg) {
		super(
			`Ahh here we go again. What is it again... Invalid command usage? \`${msg.command.name}\` has a certain format, ie, ${msg.usage(
				msg.command.format,
				msg.guild ? undefined : null,
				msg.guild ? undefined : null
			)}. Get some help through ${msg.anyUsage(
				`help ${msg.command.name}`,
				msg.guild ? undefined : null,
				msg.guild ? undefined : null
			)} for more information.`
		);
		this.name = 'CommandFormatError';
	}
}

module.exports = CommandFormatError;