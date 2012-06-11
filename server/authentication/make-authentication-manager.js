/*
Example usage:

var Auth = makeAuthenticationManager("unique_server_key_of_your_choosing_abc123", {
	userCollection: Users,
	usernameField: "login",
	passwordHashField: "password_hash",
	sessionTokenHashField: "session_token_hash"
});
*/

var makeAuthenticationManager = function (serverKey, options) {

	var settings = _.extend({
		userCollection: Users,
		usernameField: "login",
		passwordHashField: "password_hash",
		sessionTokenHashField: "session_token_hash"
	}, options);

	var getUserBySessionToken = function (sessionToken) {
		var user, query = {};

		if (isSessionTokenValid(sessionToken)) {
			query[settings.sessionTokenHashField] = getSessionTokenHash(sessionToken);
			user = settings.userCollection.findOne(query);
			if (user) {
				return user;
			}
		}
	};

	var generatePasswordHash = function (password) {
		var bcrypt = require("bcrypt");
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(password, salt);

		return hash;
	};

	var getSessionTokenHash = function (sessionToken) {
		return CryptoJS.SHA256(sessionToken).toString();
	}

	var isUserPasswordCorrect = function (user, testPassword) {
		var bcrypt = require("bcrypt");
		var userPassword;

		if (user && user[settings.passwordHashField]) {
			userPassword = user[settings.passwordHashField];

			if (!userPassword) {
				userPassword = "";
			}

			if (!testPassword) {
				testPassword = "";
			}

			return bcrypt.compareSync(testPassword, userPassword);
		}

		return false;
	};

	var generateSignedToken = function () {
		var randomToken = CryptoJS.SHA256(Math.random().toString()).toString();
		var signature = CryptoJS.HmacMD5(randomToken, serverKey).toString();
		var signedToken = randomToken + ":" + signature;

		return signedToken;
	};

	var isSessionTokenValid = function (sessionToken) {
		var parts, token, signature;

		if (!sessionToken) {
			return false;
		}

		parts = sessionToken.toString().split(":");
		token = parts[0];
		signature = parts[1];

		return signature === CryptoJS.HmacMD5(token, serverKey).toString();
	};

	var getSessionTokenForUser = function (user) {
		var sessionToken, set = {};

		// Always generate signed token, since we have no way to retrieve
		// it once it has been sent to the client upon login. We only store
		// a hash of this token in the DB for security reasons.
		sessionToken = generateSignedToken();
		set[settings.sessionTokenHashField] = getSessionTokenHash(sessionToken);
		settings.userCollection.update(user._id, {$set: set});

		return sessionToken;
	};

	var getSessionTokenForUsernamePassword = function (username, password) {
		var query = {}, user;

		query[settings.usernameField] = username;
		user = settings.userCollection.findOne(query);

		if (isUserPasswordCorrect(user, password)) {
			return getSessionTokenForUser(user);
		}
	};

	var clearUserBySessionToken = function (sessionToken) {
		var user = getUserBySessionToken(sessionToken);
		var unset = {};

		if (user) {
			unset[settings.sessionTokenHashField] = 1;
			settings.userCollection.update(user._id, {$unset: unset});
			return true;
		}
	};

	return {
		getSessionTokenForUsernamePassword: getSessionTokenForUsernamePassword,
		clearUserBySessionToken: clearUserBySessionToken,
		getUserBySessionToken: getUserBySessionToken,
		generatePasswordHash: generatePasswordHash,
		isUserPasswordCorrect: isUserPasswordCorrect
	};
};