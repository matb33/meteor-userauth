Meteor.autosubscribe(function () {
	var sessionToken = Session.get("token");
	Meteor.subscribe("publish_users", sessionToken);
	Meteor.subscribe("publish_notes", sessionToken);
});