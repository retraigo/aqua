module.exports = Eris => {
	Eris.Message.prototype.Reply = function (x) {
		return this.channel.createMessage({content: x, messageReference: {messageID: this.id}});
	}
};