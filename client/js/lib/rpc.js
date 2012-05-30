var RPC = {

	/*******************************************
	* Users
	*******************************************/

	createUser: function (name, username, password) {
		Meteor.call("createUser", getSessionToken(), name, username, password, function (error, result) {
			if (!error) {
				info("User " + name + " added successfully.");
			} else {
				info(error.reason);
			}
		});
	},

	deleteUser: function (user) {
		var name = user.name;
		Meteor.call("deleteUser", getSessionToken(), user._id, function (error, result) {
			if (!error) {
				info("User " + name + " removed successfully.");
				forgetSessionToken();	// can only remove self, so since we're deleted, log out!
			} else {
				info(error.reason);
			}
		});
	},

	/*******************************************
	* Notes
	*******************************************/

	createNote: function (title, is_private) {
		Meteor.call("createNote", getSessionToken(), title, is_private, function (error, result) {
			if (!error) {
				info("Note '" + title + "' added successfully.");
			} else {
				info(error.reason);
			}
		});
	},

	deleteNote: function (note) {
		var title = note.title;
		Meteor.call("deleteNote", getSessionToken(), note._id, function (error, result) {
			if (!error) {
				info("Note '" + title + "' removed successfully.");
			} else {
				info(error.reason);
			}
		});
	},

	/*******************************************
	* Authentication
	*******************************************/

	login: function (username, password) {
		Meteor.call("login", username, password, function (error, sessionToken) {
			if (!error) {
				rememberSessionToken(sessionToken);
				info("Password verified!");
			} else {
				info(error.reason);
			}
		});
	},

	logout: function () {
		Meteor.call("logout", getSessionToken(), function (error, result) {
			forgetSessionToken();
			if (!error) {
				info("Logout successful.");
			} else {
				info(error.reason);
			}
		});
	}
};