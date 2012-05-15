// TODO: when changing login/logout state, the users/notes aren't reflected properly.
// I think this has to do with my lack of understanding of how subscribe/publish ties to collections.
Meteor.startup(function () {
	Meteor.autosubscribe(function () {
		var sessionToken = Session.get("token");
		Meteor.subscribe("publish_users", sessionToken);
		Meteor.subscribe("publish_notes", sessionToken);
	});
});