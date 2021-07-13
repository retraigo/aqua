
module.exports = Eris => {
	Eris.TextChannel.prototype.send = function(x) {
		return this.createMessage(x)
	}
};