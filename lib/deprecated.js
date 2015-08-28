/**
 * The Dialog class
 * @param params {
 *          template:
 *          events:
 *          parseData:
 *          onShow:
 *          onVisible:
 *          onHide:
 *          onHidden:
 *          onApprove:
 *          onDeny:
 * @return {*}
 * @constructor
 */
DialogOld = function(params) {
	if (!(this instanceof DialogOld)) return new DialogOld(params);

	this._template = params.template || null;
	//this._context = params.context || null;
	this._events = params.events || {};

	// Callbacks
	this._parseData = params.parseData || function($el, data) {
		return $el.find('form').serializeJSON();
	};
	this._onShow = params.onShow || function() {};
	this._onVisible = params.onVisible || function() {};
	this._onHide = params.onHide || function() {};
	this._onHidden = params.onHidden || function() {};
	this._onApprove = params.onApprove || function() {};
	this._onDeny = params.onDeny || function() {};

	// Template param is required
	if (!this._template) return {};

	this._view = null; // The rendered View
	this._modal = null; // The jquery element for the modal

	var self = this;

	this._template.onRendered(function(){
		self.render.call(this, self);
	});
};

/**
 * Called when rendered
 * @param myDialog The dialog object
 * @param this The template instance
 * @param this.data The render context (passed to .show())
 * @private
 */
DialogOld.prototype.render = function(myDialog) {
	//console.log('Rendering dialog...');
	//console.log(myDialog);

	var myTemplate = this; // The Meteor template instance

	myDialog._modal = this.$('.ui.modal'); // Get modal jquery

	//Create the modal
	myDialog._modal.modal({
		onShow: myDialog._onShow, // User function, called when modal starts to show
		onVisible: function () { // Called when modal has finished showing (consumes user function)
			//console.log('Visible');
			var visibleSelf = this;

			// Consume the onVisible function to run our own
			myDialog._onVisible.call(visibleSelf, myTemplate);

			// We will be providing our own onApprove method that only closes if you return true or undefined
			$(visibleSelf).find('.actions .positive, .actions .approve, .actions .ok').click(function (ev) {

				var parsedData = myDialog._parseData(myDialog._modal, myTemplate.data);

				var ret = myDialog._onApprove.call(myTemplate.data, ev, myTemplate, parsedData);
				if (ret === undefined || ret === true) {
					myDialog._modal.modal('hide');
				}
			});

			// Bind the events
			//TODO there is no error checking here yet
			_(myDialog._events).each(function (func, key) {
				// For each event selector seperated by a comma:
				_(key.split(',')).each(function (ev) {
					ev = ev.trim(); //get rid of excess whitespace
					var i = ev.indexOf(' '); //determine the location of the space between event and selector
					$(visibleSelf) // bind the function to the event on the selector objects
						.find(ev.slice(i + 1, ev.length))
						.bind(ev.slice(0, i), function (ev) {
							func.call(myTemplate.data, ev, myTemplate, myDialog); //this mimics Meteor's Template.events callback with the additional dialog parameter
						});
				});
			});
		},
		onHide: myDialog._onHide, // User function, called when modal starts to hide
		onDeny: myDialog._onDeny, // User function, called after a negative, deny or cancel button is pressed
		onHidden: function () { // Called after modal has finished hiding
			//console.log('Hidden!');
			// Consume the onHidden function to run our delayed DOM removal
			myDialog._onHidden();

			//console.log(this, myDialog);

			_.delay(function () {
				//console.log('Removing');
				Blaze.remove(myDialog._view);
				myDialog._view = null;
				myDialog._modal = null;
			}, 2000);
		},
		selector: { //We override the selectors passed to Semantic UI so that it doesn't autoclose in the onApprove
			close: '.close, .actions .negative, .actions .deny, .actions .cancel'
		}
	});

	myDialog._modal.modal('show');

};

/**
 * Shows the dialog. Builds the dialog if necessary.
 */
DialogOld.prototype.show = function(context) {
	if (this._modal) {
		//console.log('Show show');
		this._modal.modal('show');
	} else {
		//console.log('Show render');
		this._view = Blaze.renderWithData(this._template, context, document.body);
	}
};

/**
 * Closes the dialog. This will eventually remove it from the DOM.
 */
DialogOld.prototype.close = function() {
	if (this._modal) {
		this._modal.modal('hide');
	}
};

/**
 * Calls Semantic UI's refresh function that refreshes centering of dialog on page.
 */
DialogOld.prototype.refresh = function() {
	if (this._modal) {
		this._modal.modal('refresh');
	}
};

// Namespace
KRT.Dialog.DialogOld = DialogOld;
