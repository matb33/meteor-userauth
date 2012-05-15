Meteor.publish("records", function() {
	return Records.find({});
});

Meteor.publish("users", function() {
	return Users.find({}, {fields: {username: 0, password_hash: 0}});
});