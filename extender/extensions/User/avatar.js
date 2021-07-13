module.exports = (Eris) => {
	Eris.User.prototype.displayAvatarURL = Eris.User.prototype.dynamicAvatarURL
};