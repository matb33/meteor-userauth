var auth = function (userCollection, usernameField, passwordHashField, sessionTokenField) {

	// The server key is meant to be a unique value for your application. Changing
	// this will make any stored session-tokens invalid and force users to re-authenticate.
	var serverKey = "552ad4c6f2c87b5ef6c4d29614d95f57";

	var getUserBySessionToken = function (sessionToken) {
		var user, query = {};

		if (isSessionTokenValid(sessionToken)) {
			query[sessionTokenField] = sessionToken;
			user = userCollection.findOne(query);
			if (user) {
				return user;
			}
		}
	};

	var generatePasswordHash = function (password) {
		var bcrypt = __meteor_bootstrap__.require("bcrypt");
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(password, salt);

		return hash;
	};

	var isUserPasswordCorrect = function (user, password) {
		var bcrypt = __meteor_bootstrap__.require("bcrypt");

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

	var getSessionTokenByUser = function (user) {
		var sessionToken, set = {};

		// Generate signed token, but only if one isn't already
		// stored. This allows the user to maintain multiple
		// sessions across different computers/browsers
		if (user[sessionTokenField]) {
			sessionToken = user[sessionTokenField];
		} else {
			sessionToken = generateSignedToken();
			set[sessionTokenField] = sessionToken;
			userCollection.update(user._id, {$set: set});
		}

		return sessionToken;
	};

	var getSessionTokenByUsernamePassword = function (username, password) {
		var query = {}, user;

		query[usernameField] = username;
		user = userCollection.findOne(query);

		if (isUserPasswordCorrect(user, password)) {
			return getSessionTokenByUser(user);
		}
	};

	var clearUserBySessionToken = function (sessionToken) {
		var user = getUserBySessionToken(sessionToken);
		var unset = {};

		if (user) {
			unset[sessionTokenField] = 1;
			userCollection.update(user._id, {$unset: unset});
			return true;
		}
	};

	return {
		getSessionTokenByUsernamePassword: getSessionTokenByUsernamePassword,
		clearUserBySessionToken: clearUserBySessionToken,
		getUserBySessionToken: getUserBySessionToken,
		generatePasswordHash: generatePasswordHash
	};
};