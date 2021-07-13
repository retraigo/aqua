module.exports = (Eris) => {
	Eris.User.prototype.send = function(content, file) {
		return new Promise((resolve, reject) => {
			this.getDMChannel().then(channel => {
				channel.createMessage(content, file).then(resolve).catch(reject);
			}).catch(reject);
		});
	};
};