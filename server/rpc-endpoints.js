/*******************************************
* Users
*******************************************/

var addUser = function (sessionToken, name, username, password) {
	var user = Auth.getUserBySessionToken(sessionToken);

	if (!user) {
		throw new Meteor.Error(403, "Not authorized to add a user.");
	}

	if (!insertUser(name, username, password)) {
		throw new Meteor.Error(500, "Unknown error when adding a user.");
	}

	return true;
};

var removeUser = function (user_id) {
	var user = Auth.getUserBySessionToken(sessionToken);

	if (!user) {
		throw new Meteor.Error(403, "Not authorized to remove a user.");
	}

	if (user._id !== user_id) {
		throw new Meteor.Error(403, "Not authorized to remove this particular user (" + user_id + ").");
	}

	if (!deleteUser(user_id)) {
		throw new Meteor.Error(500, "Unknown error when removing a user.");
	}

	return true;
};

/*******************************************
* Notes
*******************************************/

var addNote = function (sessionToken, title, is_private) {
	var user = Auth.getUserBySessionToken(sessionToken);

	if (!user) {
		throw new Meteor.Error(403, "Not authorized to add a note.");
	}

	if (!insertNote(title, user._id, is_private)) {
		throw new Meteor.Error(500, "Unknown error when adding a note.");
	}

	return true;
};

var removeNote = function (note_id) {
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

	if (!deleteNote(note_id)) {
		throw new Meteor.Error(500, "Unknown error when removing a note.");
	}

	return true;
};

/*******************************************
* Authentication
*******************************************/

var login = function (username, password) {
	var sessionToken = Auth.getSessionTokenByUsernamePassword(username, password);

	if (!sessionToken) {
		throw new Meteor.Error(401, "Invalid username and password combination.");
	}

	return sessionToken;
};

var logout = function (sessionToken) {
	var result = Auth.clearUserBySessionToken(sessionToken);

	if (!result) {
		throw new Meteor.Error(412, "Unable to logout: session token not matching a user.");
	}

	return result;
};

/*******************************************
* Expose RPC endpoints to the client via
* the Meteor.methods function
*******************************************/

Meteor.methods({
	addUser: addUser,
	addNote: addNote,
	login: login,
	logout: logout
});