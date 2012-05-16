Session.set("info_message", "");

var info = function (message) {
	Session.set("info_message", message);
};

/*******************************************
* TEMPLATE: info
*******************************************/

Template.info.has_message = function () {
	return !Session.equals("info_message", "");
};

Template.info.message = function () {
	return Session.get("info_message");
};

Template.info.events = {
	"click button[name='dismiss']": function (evt) {
		Session.set("info_message", "");
	}
};