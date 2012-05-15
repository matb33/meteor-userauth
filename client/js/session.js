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
};