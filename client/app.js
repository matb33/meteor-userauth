/*******************************************
* RPC calls
*******************************************/

var login = function (username, password) {
	RPC("login", username, password, function (result) {
		if (result.success) {
			rememberSessionToken(result.sessionToken);
			console.log("Password verified!");
		} else {
			console.log("Could not log you in with that username and/or password combination.");
		}
	});
};

var logout = function () {
	RPC("logout", Session.get("token"), function (result) {
		forgetSessionToken();
		if (result.success) {
			console.log("logout success");
		} else {
			console.log("logout failed:", result.reason);
		}
	});
};

var addRecord = function (title, is_private) {
	RPC("addRecord", title, is_private, Session.get("token"), function (result) {
		if (result.success) {
			console.log("addRecord success");
		} else {
			console.log("addRecord failed:", result.reason);
		}
	});
};

/*******************************************
* TEMPLATE: main
*******************************************/

Template.main.users = function () {
	return Users.find({});
};

Template.main.records = function () {
	return Records.find({});
};

Template.main.is_authenticated = function () {
	return Session.get("token") !== "unknown";
};

Template.main.events = {
	"click button[name='login']": function (evt) {
		login(
			$("input[name='username']").val(),
			$("input[name='password']").val()
		);
	},
	"click button[name='logout']": function (evt) {
		logout();
	},
	"click button[name='add-new-record']": function (evt) {
		addRecord(
			$("input[name='new-record-title']").val(),
			$("input[name='new-record-is-private']").is(":checked")
		);
	}
};

/*******************************************
* TEMPLATE: record_row
*******************************************/

Template.record_row.owner_name = function () {
	var user = Users.findOne({_id: this.user_id});
	return user ? user.name : "N/A";
};

/*******************************************
* Initialize
*******************************************/

initializeSessionToken();

// TODO: when changing login/logout state, the users/records aren't reflected properly.
// I think this has to do with my lack of understanding of how subscribe/publish ties to collections.
Meteor.autosubscribe(function () {
	Meteor.subscribe("users", Session.get("token"));
	Meteor.subscribe("records", Session.get("token"));
});
