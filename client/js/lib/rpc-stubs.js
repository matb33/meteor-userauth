/*******************************************
* Mirrors server-side rpc-endpoints, except
* modifies only the client, and doesn't
* bother with any authorization. If the
* server disagrees, this will automatically
* get taken care of by Meteor.
*******************************************/

Meteor.methods({

	/*******************************************
	* Users
	*******************************************/

	createUser: function (sessionToken, name, username, password) {
		var result;

		if (!(result = createUser(name, username, password))) {
			throw new Meteor.Error(500, "Unknown error when adding a user.");
		}
	},

	updateUser: function (sessionToken, user_id, properties) {
		var result;
		var user = Users.findOne();

		if (!user) {
			throw new Meteor.Error(404, "User (you) not found.");
		}

		if (!(result = updateUser(user_id, properties))) {
			throw new Meteor.Error(500, "Unknown error when updating a user.");
		}

		return result;
	},

	deleteUser: function (sessionToken, user_id) {
		var result;
		var user = Users.findOne();

		if (!user) {
			throw new Meteor.Error(404, "User (you) not found.");
		}

		if (!(result = deleteUser(user_id))) {
			throw new Meteor.Error(500, "Unknown error when removing a user.");
		}
	},

	/*******************************************
	* Notes
	*******************************************/

	createNote: function (sessionToken, title, is_private) {
		var result;
		var user = Users.findOne();

		if (!user) {
			throw new Meteor.Error(404, "User not found.");
		}

		if (!(result = createNote(title, user._id, is_private))) {
			throw new Meteor.Error(500, "Unknown error when adding a note.");
		}
	},

	updateNote: function (sessionToken, note_id, properties) {
		var result;
		var user = Users.findOne();
		var note = Notes.findOne({_id: note_id});

		if (!user) {
			throw new Meteor.Error(404, "User not found.");
		}

		if (!note) {
			throw new Meteor.Error(404, "Note not found.");
		}

		if (!(result = updateNote(note_id, properties))) {
			throw new Meteor.Error(500, "Unknown error when updating this note.");
		}
	},

	deleteNote: function (sessionToken, note_id) {
		var result;
		var user = Users.findOne();
		var note = Notes.findOne({_id: note_id});

		if (!user) {
			throw new Meteor.Error(404, "User not found.");
		}

		if (!note) {
			throw new Meteor.Error(404, "Note not found.");
		}

		if (!(result = deleteNote(note_id))) {
			throw new Meteor.Error(500, "Unknown error when removing a note.");
		}
	},

	/*******************************************
	* Authentication
	*******************************************/

	login: function (username, password) {
	},

	logout: function (sessionToken) {
	}
});