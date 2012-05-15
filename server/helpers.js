var lockdownCollection = function(name, verbs) {
	var i;
	for (i = 0; i < verbs.length; i++) {
		Meteor.default_server.method_handlers["/" + name + "/" + verbs[i]] = function() {};
	}
};