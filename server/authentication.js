/*******************************************
* Authentication methods
*******************************************/

var getUserBySessionToken = function (sessionToken) {
	var user;

	if (isSessionTokenValid(sessionToken)) {
		user = Users.findOne({session_token: sessionToken});
		if (user) {
			return user;
		}
	}
};

var isUserPasswordCorrect = function (user, password) {
	var bcrypt = __meteor_bootstrap__.require("bcrypt");

	if (user && user.password_hash) {
		return bcrypt.compareSync(password, user.password_hash);
	}

	return false;
};

var getServerKey = function () {
	// This is meant to be a unique value for your application. Changing this will
	// make any stored session tokens invalid and force users to re-authenticate.
	return "552ad4c6f2c87b5ef6c4d29614d95f57";
}

var generateSignedToken = function () {
	var randomToken = CryptoJS.SHA256(Math.random().toString()).toString();
	var signature = CryptoJS.HmacMD5(randomToken, getServerKey()).toString();
	var signedToken = randomToken + ":" + signature;

	return signedToken;
};

var isSessionTokenValid = function (sessionToken) {
	var parts = sessionToken.toString().split(":");
	var token = parts[0];
	var signature = parts[1];

	return signature === CryptoJS.HmacMD5(token, getServerKey()).toString();
};

var getSessionTokenByUser = function (user) {
	var sessionToken;

	// Generate signed token, but only if one isn't already
	// stored. This allows the user to maintain multiple
	// sessions across different computers/browsers
	if (user.session_token) {
		sessionToken = user.session_token;
	} else {
		sessionToken = generateSignedToken();
		Users.update(user._id, {$set: {session_token: sessionToken}});
	}

	return sessionToken;
};

var getSessionTokenByUsernamePassword = function (username, password) {
	var user = Users.findOne({username: username});

	if (isUserPasswordCorrect(user, password)) {
		return getSessionTokenByUser(user);
	}
};

var clearUserBySessionToken = function (sessionToken) {
	var user = getUserBySessionToken(sessionToken);

	if (user) {
		Users.update(user._id, {$unset: {session_token: 1}});
		return true;
	}
};