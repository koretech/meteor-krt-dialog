Dialog = function(params) {
	if (!(this instanceof Dialog)) return new Dialog(params);

	this._template = params.template || null;
	this._context = params.context || null;
//	this._modalSettings = params.modalSettings || null;

	// Callbacks
	this._onShow = params.onShow || function() {};
	this._onVisible = params.onVisible || function() {};
	this._onHide = params.onHide || function() {};
	this._onHidden = params.onHidden || function() {};
	this._onApprove = params.onApprove || function() {};
	this._onDeny = params.onDeny || function() {};

	if (!this._template) return {};

	this._view = null;
	this._modal = null;
};

Dialog.prototype.build = function(show) {
	var self = this;

	show = show || true;

	var originalRenderedFunc = null;
	if (self._template.rendered instanceof Function) {
		originalRenderedFunc = self._template.rendered;
	}

	self._template.rendered = function() {
		self._modal = this.$('.ui.modal'); // Get modal jquery
		if (originalRenderedFunc) originalRenderedFunc.call(this); //Run original rendered function if any

		//Create the modal
		self._modal.modal({
			onShow: self._onShow,
			onVisible: self._onVisible,
			onHide: self._onHide,
			onApprove: self._onApprove,
			onDeny: self._onDeny,
			onHidden: function() {
				// Consume the onHidden function to run our delayed DOM removal
				self._onHidden();
				_.delay(function(){
					Blaze.remove(self._view);
					self._view = null;
					self._modal = null;
				}, 2000);
			}
		});

		// Show on create if requested (default)
		if (show) self._modal.modal('show');

		// Restore the original rendered func
		self._template.rendered = originalRenderedFunc;
	};

	this._view = Blaze.renderWithData(self._template, self._context, document.body);
};

Dialog.prototype.show = function() {
	if (this._modal) {
		this._modal.modal('show');
	} else {
		this.build(true);
	}
};

Dialog.prototype.close = function() {
	if (this._modal) {
		this._modal.modal('hide');
	}
};

Dialog.prototype.refresh = function() {
	if (this._modal) {
		this._modal.modal('refresh');
	}
};

// Namespace
KRT.Dialog.Dialog = Dialog;
