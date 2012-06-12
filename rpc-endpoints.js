/*******************************************
These RPC methods are available on both the
server and the client. When called on the
server, they are authoritative. When called
on the client, authorization is skipped
where the client doesn't have enough info
to make a judgement call. The server will
take care of it. Meteor handles this for us.
*******************************************/

Meteor.methods({

	/*******************************************
	* Users
	*******************************************/

	createUser: function (sessionToken, name, username, password) {
		var result;
		var user = this.is_simulation ? Users.findOne() : Auth.getUserBySessionToken(sessionToken);

		if (!user) {
			throw new Meteor.Error(403, "Not authorized to add a user. You must be logged-in to create one.");
		}

		if (!(result = createUser(name, username, password))) {
			throw new Meteor.Error(500, "Unknown error when adding a user.");
		}

		return result;
	},

	updateUser: function (sessionToken, user_id, properties) {
		var result, existingUser;
		var user = this.is_simulation ? Users.findOne() : Auth.getUserBySessionToken(sessionToken);

		if (!user) {
			throw new Meteor.Error(403, "Not authorized to update a user.");
		}

		if (user._id !== user_id) {
			throw new Meteor.Error(403, "Not authorized to update this particular user (" + user_id + ").");
		}

		if (properties.username !== undefined) {
			existingUser = Users.findOne({username: properties.username});
			if (existingUser && existingUser._id !== user_id) {
				throw new Meteor.Error(409, "Sorry, that username is unavailable!");
			}
		}

		if (!(result = updateUser(user_id, properties))) {
			throw new Meteor.Error(500, "Unknown error when updating a user.");
		}

		return result;
	},

	deleteUser: function (sessionToken, user_id) {
		var result;
		var user = this.is_simulation ? Users.findOne() : Auth.getUserBySessionToken(sessionToken);

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
		var user = this.is_simulation ? Users.findOne() : Auth.getUserBySessionToken(sessionToken);

		if (!user) {
			throw new Meteor.Error(403, "Not authorized to add a note.");
		}

		if (!(result = createNote(title, user._id, is_private))) {
			throw new Meteor.Error(500, "Unknown error when adding a note.");
		}

		return result;
	},

	updateNote: function (sessionToken, note_id, properties) {
		var result;
		var user = this.is_simulation ? Users.findOne() : Auth.getUserBySessionToken(sessionToken);
		var note = Notes.findOne({_id: note_id});

		if (!user) {
			throw new Meteor.Error(403, "Not authorized to update this note.");
		}

		if (!note) {
			throw new Meteor.Error(404, "Note not found.");
		}

		if (user._id !== note.user_id) {
			throw new Meteor.Error(403, "Not authorized to update this note.");
		}

		if (!(result = updateNote(note_id, properties))) {
			throw new Meteor.Error(500, "Unknown error when updating this note.");
		}

		return result;
	},

	deleteNote: function (sessionToken, note_id) {
		var result;
		var user = this.is_simulation ? Users.findOne() : Auth.getUserBySessionToken(sessionToken);
		var note = Notes.findOne({_id: note_id});

		if (!user) {
			throw new Meteor.Error(403, "Not authorized to remove a note.");
		}

		if (!note) {
			throw new Meteor.Error(404, "Note not found.");
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
		var sessionToken;

		if (!this.is_simulation) {
			sessionToken = Auth.getSessionTokenForUsernamePassword(username, password);

			if (!sessionToken) {
				throw new Meteor.Error(401, "Invalid username and password combination.");
			}

			return sessionToken;
		}
	},

	logout: function (sessionToken) {
		var result;

		if (!this.is_simulation) {
			result = Auth.clearUserSessions(sessionToken);

			if (!result) {
				throw new Meteor.Error(412, "Unable to logout: session token not matching a user.");
			}

			return result;
		}
	}
});