// Example usage:
// var Auth = makeAuthenticationManager("abc123", Users, "login", "password_hash", "session_token_hash");

var makeAuthenticationManager = function (serverKey, userCollection, usernameField, passwordHashField, sessionTokenHashField) {

	var getUserBySessionToken = function (sessionToken) {
		var user, query = {};

		if (isSessionTokenValid(sessionToken)) {
			query[sessionTokenHashField] = getSessionTokenHash(sessionToken);
			user = userCollection.findOne(query);
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

	var isUserPasswordCorrect = function (user, password) {
		var bcrypt = require("bcrypt");

		if (user && user[passwordHashField]) {
			return bcrypt.compareSync(password, user[passwordHashField]);
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
		if (!sessionToken) {
			return false;
		}

		var parts = sessionToken.toString().split(":");
		var token = parts[0];
		var signature = parts[1];

		return signature === CryptoJS.HmacMD5(token, serverKey).toString();
	};

	var getSessionTokenForUser = function (user) {
		var sessionToken, set = {};

		// Always generate signed token, since we have no way to retrieve
		// it once it has been sent to the client upon login. We only store
		// a hash of this token in the DB for security reasons.
		sessionToken = generateSignedToken();
		set[sessionTokenHashField] = getSessionTokenHash(sessionToken);
		userCollection.update(user._id, {$set: set});

		return sessionToken;
	};

	var getSessionTokenForUsernamePassword = function (username, password) {
		var query = {}, user;

		query[usernameField] = username;
		user = userCollection.findOne(query);

		if (isUserPasswordCorrect(user, password)) {
			return getSessionTokenForUser(user);
		}
	};

	var clearUserBySessionToken = function (sessionToken) {
		var user = getUserBySessionToken(sessionToken);
		var unset = {};

		if (user) {
			unset[sessionTokenHashField] = 1;
			userCollection.update(user._id, {$unset: unset});
			return true;
		}
	};

	return {
		getSessionTokenForUsernamePassword: getSessionTokenForUsernamePassword,
		clearUserBySessionToken: clearUserBySessionToken,
		getUserBySessionToken: getUserBySessionToken,
		generatePasswordHash: generatePasswordHash
	};
};