/*******************************************
* Expose RPC endpoints to the client via
* the Meteor.methods function
*******************************************/

Meteor.methods({

	/*******************************************
	* Users
	*******************************************/

	createUser: function (sessionToken, name, username, password) {
		var result;
		var user = Auth.getUserBySessionToken(sessionToken);

		if (!user) {
			throw new Meteor.Error(403, "Not authorized to add a user.");
		}

		if (!(result = insertUser(name, username, password))) {
			throw new Meteor.Error(500, "Unknown error when adding a user.");
		}

		return result;
	},

	deleteUser: function (sessionToken, user_id) {
		var result;
		var user = Auth.getUserBySessionToken(sessionToken);

		if (!user) {
			throw new Meteor.Error(403, "Not authorized to remove a user.");
		}

		if (user._id !== user_id) {
			throw new Meteor.Error(403, "Not authorized to remove this particular user (" + user_id + ").");
		}

		if (!(result = deleteUser(user_id))) {
			throw new Meteor.Error(500, "Unknown error when removing a user.");
		}

		return result;
	},

	/*******************************************
	* Notes
	*******************************************/

	createNote: function (sessionToken, title, is_private) {
		var result;
		var user = Auth.getUserBySessionToken(sessionToken);

		if (!user) {
			throw new Meteor.Error(403, "Not authorized to add a note.");
		}

		if (!(result = createNote(title, user._id, is_private))) {
			throw new Meteor.Error(500, "Unknown error when adding a note.");
		}

		return result;
	},

	deleteNote: function (sessionToken, note_id) {
		var result;
		var user = Auth.getUserBySessionToken(sessionToken);
		var note = Notes.findOne({_id: note_id});

		if (!user) {
			throw new Meteor.Error(403, "Not authorized to remove a note.");
		}

		if (!note) {
			throw new Meteor.Error(404, "Can't find this particular note (" + note_id + ").");
		}

		if (note.user_id !== user._id) {
			throw new Meteor.Error(403, "Not authorized to remove this particular note (" + note_id + ").")
		}

		if (!(result = deleteNote(note_id))) {
			throw new Meteor.Error(500, "Unknown error when removing a note.");
		}

		return result;
	},

	/*******************************************
	* Authentication
	*******************************************/

	login: function (username, password) {
		var sessionToken = Auth.getSessionTokenForUsernamePassword(username, password);

		if (!sessionToken) {
			throw new Meteor.Error(401, "Invalid username and password combination.");
		}

		return sessionToken;
	},

	logout: function (sessionToken) {
		var result = Auth.clearUserBySessionToken(sessionToken);

		if (!result) {
			throw new Meteor.Error(412, "Unable to logout: session token not matching a user.");
		}

		return result;
	}
});