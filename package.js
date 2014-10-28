var client = 'client', server = 'server', both = ['client', 'server'];

Package.describe({
	name: 'krt:dialog',
	summary: 'Koretech Dialog Package',
	version: '0.1.0',
	git: 'https://github.com/koretech/meteor-krt-dialog.git'
});

Package.onUse(function(api){

	api.versionsFrom('METEOR@0.9.4');

	api.use([
		'krt:core@0.1.0',
		'templating',
		'underscore',
		'nooitaf:semantic-ui-less@0.19.3'
	], both);

	api.imply([
		'krt:core@0.1.0',
		'nooitaf:semantic-ui-less'
	]);

	api.addFiles([
		'namespaces.js'
	], both);

	api.addFiles([
		'lib/dialog.js'
	], client);

});
