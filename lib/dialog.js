/**
 * The Dialog class
 * @param params {
 *          template: The template object that contains a Semantic UI .ui.modal element
 *          context: The data context to pass to the template and dialog functions
 *          events: Event object similar to Meteor's Template.events.
 *                  Callback is (event, template, dialog) with 'this' being the current context data
 *          onShow: Is called when the dialog starts to show
 *          onVisible: Is called after a dialog has finished showing animating
 *          onHide: Is called after a dialog starts to hide
 *          onHidden: Is called after a dialog has finished hiding animating
 *          onApprove: Is called after a positive, approve or ok button is pressed. Return false to prevent dialog closure.
 *          onDeny: Is called after a negative, deny, or cancel button is pressed.
 *        }
 * @return {*}
 * @constructor
 */
Dialog = function(params) {
	if (!(this instanceof Dialog)) return new Dialog(params);

	this._template = params.template || null;
	this._context = params.context || null;
	this._events = params.events || {};

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
	var myDialog = this; // The dialog instance

	show = show || true;

	// Store the original rendered function of the template, if it exists
	var originalRenderedFunc = null;
	if (myDialog._template.rendered instanceof Function) {
		originalRenderedFunc = myDialog._template.rendered;
	}

	// Create a new rendered function for the template
	myDialog._template.rendered = function() {
		var myTemplate = this; // The Meteor template instance

		myDialog._modal = this.$('.ui.modal'); // Get modal jquery
		if (originalRenderedFunc) originalRenderedFunc.call(this); //Run original rendered function if any

		//Create the modal
		myDialog._modal.modal({
			onShow: myDialog._onShow,
			onVisible: function() {
				var visibleSelf = this;

				// Consume the onVisible function to run our own
				myDialog._onVisible.call(visibleSelf);

				// We will be providing our on onApprove method that only closes if you return true or undefined
				$(visibleSelf).find('.actions .positive, .actions .approve, .actions .ok').click(function(ev){
					var ret = myDialog._onApprove.call(myTemplate, ev, myTemplate);
					if (ret === undefined || ret === true) {
						myDialog._modal.modal('hide');
					}
				});

				// Bind the events
				//TODO there is no error checking here yet
				_(myDialog._events).each(function(func,key) {
					// For each event selector seperated by a comma:
					_(key.split(',')).each(function(ev){
						ev = ev.trim(); //get rid of excess whitespace
						var i = ev.indexOf(' '); //determine the location of the space between event and selector
						$(visibleSelf) // bind the function to the event on the selector objects
							.find(ev.slice(i+1,ev.length))
							.bind(ev.slice(0,i), function(ev) {
								func.call(myTemplate.data, ev, myTemplate, myDialog); //this mimics Meteor's Template.events callback with the additional dialog parameter
							});
					});
				});
			},
			onHide: myDialog._onHide,
			onDeny: myDialog._onDeny,
			onHidden: function() {
				// Consume the onHidden function to run our delayed DOM removal
				myDialog._onHidden();

				_.delay(function(){
					Blaze.remove(myDialog._view);
					myDialog._view = null;
					myDialog._modal = null;
				}, 2000);
			},
			selector: { //We override the selectors passed to Semantic UI so that it doesn't autoclose in the onApprove
				close: '.close, .actions .negative, .actions .deny, .actions .cancel'
			}
		});

		// Show on create if requested (default)
		if (show) myDialog._modal.modal('show');

		// Restore the original rendered func (so we don't consume it multiple times on multiple calls)
		myDialog._template.rendered = originalRenderedFunc;
	};

	this._view = Blaze.renderWithData(myDialog._template, myDialog._context, document.body);
};

/**
 * Shows the dialog. Builds the dialog if necessary.
 */
Dialog.prototype.show = function() {
	if (this._modal) {
		this._modal.modal('show');
	} else {
		this.build(true);
	}
};

/**
 * Closes the dialog. This will eventually remove it from the DOM.
 */
Dialog.prototype.close = function() {
	if (this._modal) {
		this._modal.modal('hide');
	}
};

/**
 * Calls Semantic UI's refresh function that refreshes centering of dialog on page.
 */
Dialog.prototype.refresh = function() {
	if (this._modal) {
		this._modal.modal('refresh');
	}
};

// Namespace
KRT.Dialog.Dialog = Dialog;
