/*******************************************
* Users
*******************************************/

var Users = new Meteor.Collection("users");

var createUser = function (name, username, password) {
	var user_id;

	try {
		user_id = Users.insert({
			created: Date.now(),
			modified: Date.now(),
			name: name,
			username: username,
			password_hash: Auth.generatePasswordHash(password)
		});

		return user_id;
	} catch (e) {}

	return false;
};

var updateUser = function (user_id, properties) {
	var set = {modified: Date.now()};

	if (properties.name !== undefined) set.name = properties.name;
	if (properties.username !== undefined) set.username = properties.username;
	if (properties.password !== undefined) set.password_hash = Auth.generatePasswordHash(properties.password);

	if (_.size(set)) {
		try {
			Users.update(user_id, {$set: set});
			return user_id;
		} catch (e) {}
	}

	return false;
};

var deleteUser = function (user_id) {
	var notes;

	try {
		notes = Notes.find({user_id: user_id});
		notes.forEach(function (note) {
			deleteNote(note._id);
		});

		Users.remove(user_id);
		return user_id;
	} catch (e) {}

	return false;
};

/*******************************************
* Notes
*******************************************/

var Notes = new Meteor.Collection("notes");

var createNote = function (title, user_id, is_private) {
	var note_id;

	try {
		note_id = Notes.insert({
			created: Date.now(),
			modified: Date.now(),
			title: title,
			user_id: user_id,
			is_private: is_private
		});

		return note_id;
	} catch (e) {}

	return false;
};

var updateNote = function (note_id, properties) {
	var set = {modified: Date.now()};

	if (properties.title !== undefined) set.title = properties.title;
	if (properties.user_id !== undefined) set.user_id = properties.user_id;
	if (properties.is_private !== undefined) set.is_private = properties.is_private;

	if (_.size(set)) {
		try {
			Notes.update(note_id, {$set: set});
			return note_id;
		} catch (e) {}
	}

	return false;
};

var deleteNote = function (note_id) {
	try {
		Notes.remove(note_id);
		return note_id;
	} catch (e) {}

	return false;
};