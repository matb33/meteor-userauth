/*******************************************
* Users
*******************************************/

var insertUser = function (name, username, password) {
	var user_id = Users.insert({name: name, username: username, password_hash: Auth.generatePasswordHash(password)});
	return user_id;
};

var updateUser = function (user_id, properties) {
	var set = {};
	if (properties.name) set.name = properties.name;
	if (properties.username) set.username = properties.username;
	if (properties.password) set.password_hash = Auth.generatePasswordHash(properties.password);

	return Users.update(user_id, {$set: set});
};

var deleteUser = function (user_id) {
	var notes = Notes.find({user_id: user_id});
	notes.forEach(function (note) {
		deleteNote(note._id);
	});

	return Users.remove(user_id);
};

/*******************************************
* Notes
*******************************************/

var insertNote = function (title, user_id, is_private) {
	var note_id = Notes.insert({title: title, user_id: user_id, is_private: is_private});
	return note_id;
};


var updateNote = function (note_id, properties) {
	var set = {};
	if (properties.title) set.title = properties.title;
	if (properties.user_id) set.user_id = properties.user_id;
	if (properties.is_private) set.is_private = properties.is_private;

	return Notes.update(note_id, {$set: set});
};

var deleteNote = function (note_id) {
	return Notes.remove(note_id);
};