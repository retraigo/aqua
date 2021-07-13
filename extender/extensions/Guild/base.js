const Command = require('../../../src/commands/base');


module.exports = Eris => {

    Eris.Guild.prototype.setCommandEnabled = function (command, enabled)  {
        command = this.client.registry.resolveCommand(command);
        if(command.guarded) throw new Error('The command is guarded.');
        if(typeof enabled === 'undefined') throw new TypeError('Enabled must not be undefined.');
        enabled = Boolean(enabled);
        if(!this._commandsEnabled) {
            /**
             * Map object of internal command statuses, mapped by command name
             * @type {Object}
             * @private
             */
            this._commandsEnabled = {};
        }
        this._commandsEnabled[command.name] = enabled;

        this.client.emit('commandStatusChange', this, command, enabled);
    }

     Eris.Guild.prototype.isCommandEnabled = function (command)  {
        command = this.client.registry.resolveCommand(command);
        if(command.guarded) return true;
        if(!this._commandsEnabled || typeof this._commandsEnabled[command.name] === 'undefined') {
            return command._globalEnabled;
        }
        return this._commandsEnabled[command.name];
    }

     Eris.Guild.prototype.setGroupEnabled = function (group, enabled)  {
        group = this.client.registry.resolveGroup(group);
        if(group.guarded) throw new Error('The group is guarded.');
        if(typeof enabled === 'undefined') throw new TypeError('Enabled must not be undefined.');
        enabled = Boolean(enabled);
        if(!this._groupsEnabled) {
            /**
             * Internal map object of group statuses, mapped by group ID
             * @type {Object}
             * @private
             */
            this._groupsEnabled = {};
        }
        this._groupsEnabled[group.id] = enabled;
        this.client.emit('groupStatusChange', this, group, enabled);
    }

     Eris.Guild.prototype.isGroupEnabled = function (group)  {
        group = this.client.registry.resolveGroup(group);
        if(group.guarded) return true;
        if(!this._groupsEnabled || typeof this._groupsEnabled[group.id] === 'undefined') return group._globalEnabled;
        return this._groupsEnabled[group.id];
    }


     Eris.Guild.prototype.commandUsage = function (command, user = this.client.user)  {
        return Command.usage(command, this.commandPrefix, user);
    }

}