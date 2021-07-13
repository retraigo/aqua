const discord = require('../extender/index')(require('eris'))
const AquaRegistry = require('./registry');
const AquaDispatcher = require('./dispatcher');
const GuildSettingsHelper = require('./providers/helper');

class AquaClient extends discord.Client {

	/**
	 * Options for the AquaClient
	 * @typedef {object} AquaClientOptions
	 * @property {string} [prefix=?] - Command prefix of the bot
	 * @property {number} [commandEditableDuration=30] - Time in seconds that command messages should be editable
	 * @property {boolean} [nonCommandEditable=true] - Whether messages without commands can be edited to a command
	 * @property {string|string[]|Set<string>} [master] - ID(s) of the bot owner(s)
     * @property {string|string[]|Set<string>} [staff] - ID(s) of bot's staff(s) (specifically to staff-lock commands)
	 * @property {string} [invite] - Invite link to the bot's support server (to be used in case of an error)
	 */

 /**
  * 
  * @param {string} [token] - Token of the bot
  * @param {object} [clientOptions] - Options to initiate the Eris client with
  * @param {AquaClientOptions} [commandOptions] - Options to initiate the AquaClient with
  */
 


	constructor(token, clientOptions, commandOptions = {}) {
		if(typeof commandOptions.commandPrefix === 'undefined') commandOptions.commandPrefix = '!';
		if(commandOptions.commandPrefix === null) commandOptions.commandPrefix = '';
		if(typeof commandOptions.commandEditableDuration === 'undefined') commandOptions.commandEditableDuration = 30;
		if(typeof commandOptions.nonCommandEditable === 'undefined') commandOptions.nonCommandEditable = true;
		super(token, clientOptions);

        /**
         * Registry managing all commands
         * @typedef {Commander}
         */
		this.registry = new AquaRegistry(this);

                /**
         * The AquaClient's command handler
         * @typedef {Minion}
         */
		this.dispatcher = new AquaDispatcher(this, this.registry);

                /**
         * Options the AquaClient was initiated with
         * @typedef {AquaClientOptions}
         */
		this.commandOptions = commandOptions

		this.provider = null;

                /**
         * Settings manager.
         * @typedef {GuildSettingsHelper}
         */
		this.settings = new GuildSettingsHelper(this, null);

                /**
         * Command prefix managed by the settings helper. If no prefix is found, defaults to the prefix in {@link AquaClientOptions#commandPrefix}
         * @typedef {string}
         */
		this._commandPrefix = null;

		// Set up command handling
		const msgErr = err => { this.emit('error', err); };
		this.on('messageCreate', async (message) => {
			if(!message.author) return

			return this.dispatcher.handleMessage(message).catch(msgErr); 
		});
		this.on('messageUpdate', async (oldMessage, newMessage) => {
			if(!newMessage.author) return
			if(!oldMessage.author) return



			this.dispatcher.handleMessage(newMessage, oldMessage).catch(msgErr);
		});

		// Fetch the master(s)
		if(commandOptions.master) {
			this.once('ready', () => {
				if(commandOptions.master instanceof Array || commandOptions.master instanceof Set) {
					for(const master of commandOptions.master) {
						this.getRESTUser(master).catch(err => {
							this.emit('warn', `Unable to fetch master ${master}.`);
							this.emit('error', err);
						});
					}
				} else {
					this.getRESTUser(commandOptions.master).catch(err => {
						this.emit('warn', `Unable to fetch master ${commandOptions.master}.`);
						this.emit('error', err);
					});
				}
			});
		}
	

	if(commandOptions.staff) {
		this.once('ready', () => {
			if(commandOptions.staff instanceof Array || commandOptions.staff instanceof Set) {
				for(const staff of commandOptions.staff) {
					this.getRESTUser(staff).catch(err => {
						this.emit('warn', `Unable to fetch staff user ${staff}.`);
						this.emit('error', err);
					});
				}
			} else {
				this.getRESTUser(commandOptions.staff).catch(err => {
					this.emit('warn', `Unable to fetch staff user ${commandOptions.staff}.`);
					this.emit('error', err);
				});
			}
		});
	}

	}
	

	/**
	 * Global command prefix getter/setter
	 * @type {string}
	 * @emits {@link AquaClient#prefixUpdate}
	 */

	get commandPrefix() {
		if(typeof this._commandPrefix === 'undefined' || this._commandPrefix === null) return this.commandOptions.commandPrefix;
		return this._commandPrefix;
	}

	set commandPrefix(prefix) {
		this._commandPrefix = prefix;
		this.emit('prefixUpdate', null, this._commandPrefix);
	}

	get masters() {
		if(!this.commandOptions.master) return null;
		if(typeof this.commandOptions.master === 'string') return [this.users.get(this.commandOptions.master)];
		const masters = [];
		for(const master of this.commandOptions.master) masters.push(this.users.get(master));
		return masters;
	}

	isMaster(user) {
		if(!this.commandOptions.master) return false;
		user = this.users.get(user.id || user);
		if(!user) throw new RangeError('Unable to resolve user.');
		if(typeof this.commandOptions.master === 'string') return user.id === this.commandOptions.master;
		if(this.commandOptions.master instanceof Array) return this.commandOptions.master.includes(user.id);
		if(this.commandOptions.master instanceof Set) return this.commandOptions.master.has(user.id);
		throw new RangeError('The client\'s "master" option is an unknown value.');
	}

	isStaff(user) {
        if(!this.commandOptions.staff) return false;
		user = this.users.get(user.id || user);
		if(!user) throw new RangeError('Unable to resolve user.');
		if(typeof this.commandOptions.staff === 'string') return user.id === this.commandOptions.staff;
		if(this.commandOptions.staff instanceof Array) return this.commandOptions.staff.includes(user.id);
		if(this.commandOptions.staff instanceof Set) return this.commandOptions.staff.has(user.id);
		throw new RangeError('The client\'s "staff" option is an unknown value.');
	}


	async setProvider(provider) {
		const newProvider = await provider;
		this.provider = newProvider;

		if(this.readyTimestamp) {
			this.emit('debug', `Provider set to ${newProvider.constructor.name} - initialising...`);
			await newProvider.init(this);
			this.emit('debug', 'Provider finished initialisation.');
			return undefined;
		}

		this.emit('debug', `Provider set to ${newProvider.constructor.name} - will initialise once ready.`);
		await new Promise(resolve => {
			this.once('ready', () => {
				this.emit('debug', `Initialising provider...`);
				resolve(newProvider.init(this));
			});
		});

		this.emit('providerReady', provider);
		this.emit('debug', 'Provider finished initialisation.');
		return undefined;
	}

	async disconnect() {
		await super.disconnect();
		if(this.provider) await this.provider.destroy();
	}
}

module.exports = AquaClient;