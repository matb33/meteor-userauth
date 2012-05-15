Meteor.publish("records", function(sessionToken) {
	var user;
	if (user = Auth.getUserBySessionToken(sessionToken)) {
		return Records.find({$or: [{is_private: false}, {$and: [{is_private: true}, {user_id: user._id}]}]});
	} else {
		return Records.find({is_private: false});
	}
});

Meteor.publish("users", function(sessionToken) {
	//var user;
	//if (user = Auth.getUserBySessionToken(sessionToken)) {
		return Users.find({}, {fields: {username: 0, password_hash: 0}});
	//}
});