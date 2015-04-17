var client = 'client', server = 'server', both = ['client', 'server'];

Package.describe({
	name: 'krt:dialog',
	summary: 'Koretech Dialog Package',
	version: '0.1.4',
	git: 'https://github.com/koretech/meteor-krt-dialog.git',
	documentation: null
});

Package.onUse(function(api){

	api.versionsFrom('METEOR@1.0');

	api.use([
		'krt:core@0.1.3',
		'templating',
		'underscore',
		'semantic:ui-css@1.12.0'
	], both);

	api.imply([
		'krt:core',
		'semantic:ui-css'
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
