Meteor.publish("publishedNotes", function (sessionToken) {
	var self = this;
	var sessionUser = Auth.getUserBySessionToken(sessionToken);
	var sessionUserID = sessionUser ? sessionUser._id : 0;
	var notes;

	if (sessionUser) {
		notes = Notes.find({$or: [{is_private: false}, {$and: [{is_private: true}, {user_id: sessionUser._id}]}]});
	} else {
		notes = Notes.find({is_private: false});
	}

	var upsertHandler = function (note, idx) {
		// Add virtual field __is_owned_by_session_user
		note.__is_owned_by_session_user = sessionUserID === note.user_id;

		self.set("notes", note._id, note);
		self.flush();
	};

	var handle = notes.observe({added: upsertHandler, changed: upsertHandler});

	self.onStop(function () {
		handle.stop();
		self.flush();
	});
});

Meteor.publish("publishedUsers", function (sessionToken) {
	var self = this;
	var sessionUser = Auth.getUserBySessionToken(sessionToken);
	var sessionUserID = sessionUser ? sessionUser._id : 0;
	var users = Users.find({}, {fields: {username: false, password_hash: false}});

	var upsertHandler = function (user, idx) {
		// Add virtual field __is_session_user
		user.__is_session_user = sessionUserID === user._id;

		self.set("users", user._id, user);
		self.flush();
	};

	var handle = users.observe({added: upsertHandler, changed: upsertHandler});

	self.onStop(function () {
		handle.stop();
		self.flush();
	});
});