const EventEmitter = require("events").EventEmitter;
const collectors = [];
const Collection = require('@discordjs/collection')

class ReactionCollector extends EventEmitter {
	constructor(message, filter, options = {}) {
		super();
		this.filter = filter;
		this.channel = message.channel;
		this.options = options;
        this.message = message
		this.ended = false;
		this.collected = new Collection()

		collectors.push(this);
		if(options.time) setTimeout(() => this.stop("time"), options.time);
	}

	verify(message, reaction, user) {
		if(this.message.id !== message.id) return false;
		if(this.filter(reaction)) {
			this.collected.set(user.id, reaction);

			this.emit("collect", reaction, user);
			if(this.collected.size >= this.options.max) {
				this.stop("maxMatches");
			}
			return true;
		}

		return false;
	}

	stop(reason) {
		if(this.ended) return;
		this.ended = true;

		collectors.splice(collectors.indexOf(this), 1);
		this.emit("end", this.collected, reason);
	}
}

let listening = false;
module.exports = Eris => {
	Eris.Message.prototype.createReactionCollector = function (filter, options) {
		if(!listening) {
			this.client.on("messageReactionAdd", (message, emoji, user) => {
				for(const collector of collectors) collector.verify(message, emoji, user);
			});
			listening = true;
		}

		const collector = new ReactionCollector(this, filter, options);
		return collector
	};
	return Eris
};

