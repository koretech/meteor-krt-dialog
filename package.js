var client = 'client', server = 'server', both = ['client', 'server'];

Package.describe({
	name: 'krt:dialog',
	summary: 'Koretech Dialog Package',
	version: '0.2.1',
	git: 'https://github.com/koretech/meteor-krt-dialog.git',
	documentation: null
});

Package.onUse(function(api){

	api.versionsFrom('METEOR@1.2');

	api.use([
		'krt:core@0.1.4',
		'templating',
		'underscore'
	], both);

	api.imply([
		'krt:core'
	]);

	api.addFiles([
		'namespaces.js'
	], both);

	api.addFiles([
		'lib/dialog.js',
		'lib/defaults.html',
		'lib/defaults.js'
	], client);

});
