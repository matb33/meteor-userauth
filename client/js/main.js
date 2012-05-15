/*******************************************
* TEMPLATE: main
*******************************************/

Template.main.users = function () {
	return Users.find({});
};

Template.main.notes = function () {
	return Notes.find({});
};

Template.main.notes_for_user = function () {
	return Notes.find({user_id: this._id});
};

Template.main.is_authenticated = function () {
	return Session.get("token") !== "unknown";
};

Template.main.events = {
	"click button[name='login']": function (evt) {
		evt.preventDefault();
		login(
			$("input[name='username']").val(),
			$("input[name='password']").val()
		);
	},
	"click button[name='logout']": function (evt) {
		logout();
	},
	"click button[name='add-new-note']": function (evt) {
		evt.preventDefault();
		addNote(
			$("input[name='new-note-title']").val(),
			$("input[name='new-note-is-private']").is(":checked")
		);
	}
};

/*******************************************
* TEMPLATE: note_row
*******************************************/

Template.note_row.owner_name = function () {
	var user = Users.findOne({_id: this.user_id});
	return user ? user.name : "N/A";
};

Template.note_row.is_owned_by_session_user = function () {
	//return isNoteOwnedBySessionUser(this);
	return false;
};

Template.note_row.events = {
	"click button[name='delete']": function (evt) {
	}
};