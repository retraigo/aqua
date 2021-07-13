module.exports = Eris => {

Eris.Guild.prototype._commandPrefix = null
Object.defineProperty(Eris.Guild.prototype, "commandPrefix", {

             get: function commandPrefix() {
				if(this._commandPrefix === null) return this.client.commandPrefix;
				return this._commandPrefix;
			},
	
			set: function commandPrefix(prefix) {
				this._commandPrefix = prefix;
				this.client.emit('commandPrefixChange', this, this._commandPrefix);
			}
});

return Eris
}