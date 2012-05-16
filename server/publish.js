Meteor.publish("publish_notes", function (sessionToken) {
	// TODO, isNoteOwnedBySessionUser should be removed and this logic should be done here somehow and adding a
	// virtual field (__is_owned_by_session_user boolean)
	var user;
	if (user = Auth.getUserBySessionToken(sessionToken)) {
		return Notes.find({$or: [{is_private: false}, {$and: [{is_private: true}, {user_id: user._id}]}]});
	} else {
		return Notes.find({is_private: false});
	}
});

Meteor.publish("publish_users", function (sessionToken) {
	return Users.find({}, {fields: {username: false, password_hash: false}});
});