var client = 'client', server = 'server', both = ['client', 'server'];

Package.describe({
	name: 'krt:dialog',
	summary: 'Koretech Dialog Package',
	version: '0.1.2',
	git: 'https://github.com/koretech/meteor-krt-dialog.git',
	documentation: null
});

Package.onUse(function(api){

	api.versionsFrom('METEOR@1.0');

	api.use([
		'krt:core@0.1.2',
		'templating',
		'underscore',
		'nooitaf:semantic-ui@1.9.1'
	], both);

	api.imply([
		'krt:core',
		'nooitaf:semantic-ui@1.9.1'
	]);

	api.addFiles([
		'namespaces.js'
	], both);

	api.addFiles([
		'lib/dialog.js'
	], client);

});
