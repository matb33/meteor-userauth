Meteor.startup(function () {
	Meteor.autosubscribe(function () {
		var sessionToken = getSessionToken();
		Meteor.subscribe("publishedUsers", sessionToken);
		Meteor.subscribe("publishedNotes", sessionToken);
	});
});