/*******************************************
* RPC helper callback
*******************************************/

var RPC = function () {
	var args = arguments;
	var callback = args[args.length - 1];

	if (typeof callback === "function") {
		args[args.length - 1] = function (error, result) {
			if (!error) {
				callback.call(this, result);
			} else {
				console.log("RPC error:", error);
			}
		};
	}

	Meteor.call.apply(this, args);
};

/*******************************************
* Session token management
*******************************************/

var initializeSessionToken = function () {
	Session.set("token", $.cookie("X_SESSION_TOKEN") || "unknown");
};

var rememberSessionToken = function (sessionToken) {
	sessionToken = sessionToken || "";
	sessionToken = sessionToken === "" ? "unknown" : sessionToken;
	$.cookie("X_SESSION_TOKEN", sessionToken);
	Session.set("token", sessionToken);
};

var forgetSessionToken = function () {
	$.cookie("X_SESSION_TOKEN", "unknown");
	Session.set("token", "unknown");
}