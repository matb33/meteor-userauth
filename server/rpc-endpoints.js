/*******************************************
* Users
*******************************************/

var addUser = function (sessionToken, name, username, password) {
	var user, result = {};

	if (user = Auth.getUserBySessionToken(sessionToken)) {
		if (!insertUser(name, username, password)) {
			throw new Meteor.Error(500, "Unknown error when adding a user.");
		}
	} else {
		throw new Meteor.Error(403, "Not authorized to add a user.");
	}

	return true;
};

/*******************************************
* Notes
*******************************************/

var addNote = function (sessionToken, title, is_private) {
	var user;

	if (user = Auth.getUserBySessionToken(sessionToken)) {
		if (!insertNote(title, user._id, is_private)) {
			throw new Meteor.Error(500, "Unknown error when adding a note.");
		}
	} else {
		throw new Meteor.Error(403, "Not authorized to add a note.");
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