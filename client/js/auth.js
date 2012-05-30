/*******************************************
* TEMPLATE: auth
*******************************************/

Template.auth.is_authenticated = function () {
	return getSessionToken() !== "unknown";
};

Template.auth.events = {
	"click button[name='login']": function (evt) {
		RPC.login(
			$("input[name='username']").val(),
			$("input[name='password']").val()
		);

		evt.preventDefault();
	},
	"click button[name='logout']": function (evt) {
		RPC.logout();
	}
};