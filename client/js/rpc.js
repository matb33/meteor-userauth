/*******************************************
* Users
*******************************************/

var addUser = function (name, username, password) {
	Meteor.call("addUser", Session.get("token"), name, username, password, function (error, result) {
		if (!error) {
			console.log("addUser success");
		} else {
			console.log(JSON.stringify(error));
		}
	});
};

/*******************************************
* Notes
*******************************************/

var addNote = function (title, is_private) {
	Meteor.call("addNote", Session.get("token"), title, is_private, function (error, result) {
		if (!error) {
			console.log("addNote success");
		} else {
			console.log(JSON.stringify(error));
		}
	});
};

/*******************************************
* Authentication
*******************************************/

var login = function (username, password) {
	Meteor.call("login", username, password, function (error, sessionToken) {
		if (!error) {
			rememberSessionToken(sessionToken);
			console.log("Password verified!");
		} else {
			console.log(JSON.stringify(error));
		}
	});
};

var logout = function () {
	Meteor.call("logout", Session.get("token"), function (error, result) {
		forgetSessionToken();
		if (!error) {
			console.log("logout success");
		} else {
			console.log(JSON.stringify(error));
		}
	});
};