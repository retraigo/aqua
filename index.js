module.exports = {
	AquaClient: require('./src/client'),
	Client: require('./src/client'),
	Registry: require('./src/registry'),
	Secretary: require('./src/secretary'),
	Command: require('./src/commands/base'),
	CommandGroup: require('./src/commands/group'),
	ArgumentCollector: require('./src/commands/collector'),
	Argument: require('./src/commands/argument'),
	ArgumentType: require('./src/types/base'),
	FriendlyError: require('./src/errors/friendly'),
	CommandFormatError: require('./src/errors/command-format'),

	util: require('./src/util'),

	SettingProvider: require('./src/providers/base'),
	get SQLiteProvider() {
		return require('./src/providers/sqlite');
	},
	get SyncSQLiteProvider() {
		return require('./src/providers/sqlite-sync');
	}
};