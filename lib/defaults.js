KRT.Dialog.areYouSure = function(message, callback) {
	var d = new KRT.Dialog.Dialog({
		template: Template.krtDialogAreYouSure,
		context: {message:message},
		onApprove: callback
	});
	d.show();
};
