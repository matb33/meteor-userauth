/*******************************************
* TEMPLATE: notes
*******************************************/

Template.notes.users = function () {
	return Users.find();
};

Template.notes.notes = function () {
	return Notes.find();
};

Template.notes.notes_for_user = function () {
	return Notes.find({user_id: this._id});
};

Template.notes.events = {
	"click button[name='add']": function (evt) {
		var $form = $(evt.target).closest("form");

		RPC.createNote(
			$("input[name='title']", $form).val(),
			$("input[name='is_private']", $form).is(":checked")
		);

		$form[0].reset();
		evt.preventDefault();
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
	return this.__is_owned_by_session_user;
};

Template.note_row.events = {
	"click button[name='delete']": function (evt) {
		RPC.deleteNote(this);
	}
};