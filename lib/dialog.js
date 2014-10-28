/**
 * Dialog Class
 * @param opts
 * @constructor
 */
KRT.Dialog.Dialog = function(opts) {
	var self = this;

	/*
	opts = {
		template: Template.instance,
		context: {
			//data context for the dialog template
		},
		modalSettings: {
			//any settings passed to semantic ui modal
		}
	}
	 */
	self.opts = opts;

	// Defaults
	self.opts = _.extend({
		modalSettings: {}
	}, opts);

	self.rendered = null;

	// Function to remove the template after a short delay
	self.removeTemplate = function() {
//		console.log('Remove Template');
		_.delay(function(){
			Blaze.remove(self.rendered);
			self.rendered = undefined;
		}, 2000);
	};

	if (_(self.opts.modalSettings.onHidden).isFunction()) {
		// If an onHidden() event function is defined, consume it
//		console.log('onHidden exists, consuming...');
		var hiddenFunc = self.opts.modalSettings.onHidden;
		self.opts.modalSettings.onHidden = function() {
			hiddenFunc.call();
			self.removeTemplate.call(); // Add our template removal function
		}
	} else {
		self.opts.modalSettings.onHidden = self.removeTemplate;
	}
};

/**
 * Show the dialog
 */
KRT.Dialog.Dialog.prototype.show = function() {
	var self = this;

	if (_(self.opts.template.rendered).isFunction()) {
		// If the template has a rendered function defined, consume it
//		console.log('Template.rendered exists, consuming...');

		var bkup = self.opts.template.rendered;

		self.opts.template.rendered = function() {
//			console.log('Rendered');
			bkup.call(this);

			// Initialize and show modal
			this.$('.ui.modal')
				.modal(self.opts.modalSettings)
				.modal('show');

			// Reset rendered function
			self.opts.template.rendered = bkup;
		}
	} else {

		self.opts.template.rendered = function() {
//			console.log('Rendered');
			this.$('.ui.modal')
				.modal(self.opts.modalSettings)
				.modal('show');

			self.opts.template.rendered = undefined;
		}
	}

	// Render and insert template
	var body = document.body;
	this.rendered = (this.opts.context) ? Blaze.renderWithData(this.opts.template, this.opts.context, body) : Blaze.render(this.opts.template, body);
};
