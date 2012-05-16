Meteor.autosubscribe(function () {
	var sessionToken = getSessionToken();
	Meteor.subscribe("publish_users", sessionToken);
	Meteor.subscribe("publish_notes", sessionToken);
});