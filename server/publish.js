Meteor.publish("publishedNotes", function (sessionToken) {
	var sessionUser = Auth.getUserBySessionToken(sessionToken);
	var sessionUserID = sessionUser ? sessionUser._id : 0;
	var notes;

	if (sessionUser) {
		notes = Notes.find({$or: [{is_private: false}, {$and: [{is_private: true}, {user_id: sessionUser._id}]}]});
	} else {
		notes = Notes.find({is_private: false});
	}

	this.publishModifiedCursor(notes, "notes", function (note) {
		note.__is_owned_by_session_user = sessionUserID === note.user_id;
		return note;
	});
});

Meteor.publish("publishedUsers", function (sessionToken) {
	var sessionUser = Auth.getUserBySessionToken(sessionToken);
	var sessionUserID = sessionUser ? sessionUser._id : 0;
	var users = Users.find({}, {fields: {username: false, password_hash: false}});

	this.publishModifiedCursor(users, "users", function (user) {
		user.__is_session_user = sessionUserID === user._id;
		return user;
	});
});

// Extension to Meteor to allow modifications to documents when publishing
_.extend(Meteor._LivedataSubscription.prototype, {
	publishModifiedCursor: function (cursor, name, map_callback) {
		var self = this;
		var collection = name || cursor.collection_name;

		var observe_handle = cursor.observe({
			added: function (obj) {
				obj = map_callback.call(self, obj);
				self.set(collection, obj._id, obj);
				self.flush();
			},
			changed: function (obj, old_idx, old_obj) {
				var set = {};
				obj = map_callback.call(self, obj);
				_.each(obj, function (v, k) {
					if (!_.isEqual(v, old_obj[k])) {
						set[k] = v;
					}
				});
				self.set(collection, obj._id, set);
				var dead_keys = _.difference(_.keys(old_obj), _.keys(obj));
				self.unset(collection, obj._id, dead_keys);
				self.flush();
			},
			removed: function (old_obj, old_idx) {
				self.unset(collection, old_obj._id, _.keys(old_obj));
				self.flush();
			}
		});

		self.complete();
		self.flush();

		self.onStop(_.bind(observe_handle.stop, observe_handle));
	}
});