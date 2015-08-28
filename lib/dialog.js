function dialog_render(template) {
	//console.log('Rendering dialog');

	var $modal = this.$('.ui.modal');
	var params = this.view.template._dialogParams;
	var view = this.view;
	var renderSelf = this;

	$modal.modal({
		onShow: params.onShow,
		onVisible: function() {
			var visibleSelf = this;

			// Run the user specified onVisible call
			if (_.isFunction(params.onVisible))	params.onVisible.call(visibleSelf);

			// We will be providing our own onApprove method that only closes if you return true or undefined
			$(visibleSelf).find('.actions .positive, .actions .approve, .actions .ok').click(function (ev) {

				var ret = params.onApprove.call(renderSelf.data, ev, renderSelf, $modal);
				if (ret === undefined || ret === true) {
					$modal.modal('hide');
				}
			});

			// Bind the events
			//TODO there is no error checking here yet
			_(params.events).each(function (func, key) {
				// For each event selector seperated by a comma:
				_(key.split(',')).each(function (ev) {
					ev = ev.trim(); //get rid of excess whitespace
					var i = ev.indexOf(' '); //determine the location of the space between event and selector
					$(visibleSelf) // bind the function to the event on the selector objects
						.find(ev.slice(i + 1, ev.length))
						.bind(ev.slice(0, i), function (ev) {
							func.call(renderSelf.data, ev, renderSelf, $modal); //this mimics Meteor's Template.events callback with the additional dialog parameter
						});
				});
			});

		},
		onHide: params.onHide, // User call, called when modal starts to hide
		onDeny: params.onDeny, // User call, called after a negative, deny or cancel button is pressed
		onHidden: function() {
			//console.log('Hiding modal');

			// Run the user specified onHidden call
			if (_.isFunction(params.onHidden)) params.onHidden.call(this);

			// Delay deleting from the DOM for 2 seconds
			_.delay(function() {
				//console.log('Deleting');
				Blaze.remove(view);
			}, 2000);
		},
		selector: { //We override the selectors passed to Semantic UI so that it doesn't autoclose in the onApprove
			close: '.close, .actions .negative, .actions .deny, .actions .cancel'
		}
	});

	$modal.modal('show');
}

Dialog = function(params) {

	// Add a 'dialog' rendered function to the template only once
	if (!params.template._dialogInit) {
		params.template.onRendered(function(){
			dialog_render.call(this, params.template);
		});
		params.template._dialogInit = true;
	}

	params.onApprove = params.onApprove || function() {};
	params.events = params.events || {};

	params.template._dialogParams = params;
	Blaze.renderWithData(params.template, params.data, document.body);
};

KRT.Dialog.Dialog = Dialog;
