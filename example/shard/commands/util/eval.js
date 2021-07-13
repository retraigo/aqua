const util = require('util');
const { splitMessage } = require('../../../../src/util');
const tags = require('common-tags');
const active = new Map();
const nl = '!!NL!!';
const nlPattern = new RegExp(nl, 'g');
const Eris = require('../../../../extender/index')(require('eris'))


const regexforjson = /\{.*\:\{.*\:.*\}\}/g
const regexforjson2 = /\{(?:[^{}]|())*\}/g

function escapeRegex(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}
const { Command } = require("../../../../index");


module.exports = class EvalCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'eval',
			group: 'util',
			memberName: 'eval',
			description: 'Executes JavaScript code.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			
		});

		this.lastResult = null;
		Object.defineProperty(this, '_sensitivePattern', { value: null, configurable: true });
	}

	run(message, args) {
		// Make a bunch of helpers
		/* eslint-disable no-unused-vars */
        let pattern = new RegExp(
            `^(<@!?${'700413931214209197'}>\\s+(?:${'kuro'}\\s*)?|${'kuro'}\\s*)([^\\s]+)`, 'i'
        );
        let script = message.content.replace(pattern, "")
    message.addReaction(":kurook:711978903224451132")

    const client = message.client;
		const lastResult = this.lastResult;
		const doReply = val => {
			if(val instanceof Error) {
				message.reply(`Callback error: \`${val}\``);
			} else {
				const result = this.makeResultMessages(val, process.hrtime(this.hrStart));
				if(Array.isArray(result)) {
					for(const item of result) message.reply(item);
				} else {
					message.reply(result);
				}
			}
		};
		/* eslint-enable no-unused-vars */

		// Run the code and measure its execution time
		let hrDiff;
		try {
			const hrStart = process.hrtime();
			this.lastResult = eval(script);
			hrDiff = process.hrtime(hrStart);
		} catch(err) {
			return message.reply(`Error while evaluating: \`${err}\``);
		}

		// Prepare for callback time and respond
		this.hrStart = process.hrtime();
		const result = this.makeResultMessages(this.lastResult, hrDiff, args.script);
		if(Array.isArray(result)) {
			return result.map(item => message.reply(item));
		} else {
			return message.reply(result);
		}
	}

	makeResultMessages(result, hrDiff, input = null) {
		const inspected = util.inspect(result, { depth: 0 })
			.replace(nlPattern, '\n')
			.replace(this.sensitivePattern, '--snip--');
		const split = inspected.split('\n');
		const last = inspected.length - 1;
		const prependPart = inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== "'" ? split[0] : inspected[0];
		const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== "'" ?
			split[split.length - 1] :
			inspected[last];
		const prepend = `\`\`\`javascript\n${prependPart}\n`;
		const append = `\n${appendPart}\n\`\`\``;
		if(input) {
			return splitMessage(tags.stripIndents`
				*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
				\`\`\`javascript
				${inspected}
				\`\`\`
			`, { maxLength: 1900, prepend, append });
		} else {
			return splitMessage(tags.stripIndents`
				*Callback executed after ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
				\`\`\`javascript
				${inspected}
				\`\`\`
			`, { maxLength: 1900, prepend, append });
		}
	}

	regexforjson = /\{.*\:\{.*\:.*\}\}/g
	regexforjson2 = /\{(?:[^{}]|())*\}/g

	findJson(text) {
		return /\{.*\:\{.*\:.*\}\}/.exec(text)
	}

	get sensitivePattern() {
		if(!this._sensitivePattern) {
			const client = this.client;
			let pattern = '';
            let token = require('../../config').Discord
			if(token) pattern += escapeRegex(token);
			Object.defineProperty(this, '_sensitivePattern', { value: new RegExp(pattern, 'gi'), configurable: false });
		}
		return this._sensitivePattern;
	}
};