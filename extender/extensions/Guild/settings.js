
const GuildSettingsHelper = require('../../../src/providers/helper');


module.exports = Eris => {

    Object.defineProperty(Eris.Guild.prototype, "settings", {
        get: function() {
           return new GuildSettingsHelper(this.client, this);        
        }
      });


}