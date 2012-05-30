/*******************************************
* TEMPLATE: users
*******************************************/

Template.users.users = function () {
	return Users.find();
};

Template.users.events = {
	"click button[name='add']": function (evt) {
		var $form = $(evt.target).closest("form");

		RPC.createUser(
			$("input[name='name']", $form).val(),
			$("input[name='username']", $form).val(),
			$("input[name='password']", $form).val()
		);

		$form[0].reset();
		evt.preventDefault();
	}
};

/*******************************************
* TEMPLATE: user_row
*******************************************/

Template.user_row.is_session_user = function () {
	return this.__is_session_user;
};

Template.user_row.events = {
	"click button[name='delete']": function (evt) {
		RPC.deleteUser(this);
	}
};