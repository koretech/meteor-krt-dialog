
KRT.Dialog.areYouSure = function(message, callback) {
	KRT.Dialog.Dialog({
		template: Template.krtDialogAreYouSure,
		data: {message:message},
		onApprove: callback
	});
};
