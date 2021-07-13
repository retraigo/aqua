const Collection = require('@discordjs/collection');


module.exports = Eris => {
	Object.defineProperty(Eris.Client.prototype, "channels", {
        
		get: function() {
            const channels = new Collection()
            let channelstuff = this.channelGuildMap
            let channelIDs = Object.keys(channelstuff)
            for(let i = channelIDs.length; i > 0; --i) {
                let channelID = channelIDs[i-1]
                let channelobj = {channel: channelID, guild: channelstuff[channelID]}
                channels.set(channelID, channelobj)
            }

			return channels;
		}
	});
};