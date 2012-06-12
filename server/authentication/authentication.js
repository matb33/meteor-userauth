/*
Example usage:

var Auth = makeAuthenticationManager("unique_server_key_of_your_choosing_abc123", {
	userCollection: Users,
	usernameField: "login",
	passwordHashField: "password_hash",
	sessionCollection: UserSessions
});
*/

var UserSessions = new Meteor.Collection("authentication__user_sessions");

var makeAuthenticationManager = function (serverKey, options) {

	var settings = _.extend({
		userCollection: Users,
		usernameField: "login",
		passwordHashField: "password_hash",
		sessionCollection: UserSessions,
		sessionLongevitySeconds: 7 * 24 * 60 * 60
	}, options);

	var AuthUsers = settings.userCollection;
	var AuthUserSessions = settings.sessionCollection;

	var getUserSessionBySessionToken = function (sessionToken) {
		var session, hash;

		if (isSessionTokenValid(sessionToken)) {
			hash = getSessionTokenHash(sessionToken);
			session = AuthUserSessions.findOne({"hash": hash});
			if (session) {
				if (Date.now() <= session.expires) {
					return session;
				} else {
					AuthUserSessions.remove({_id: session._id});
				}
			}
		}
	};

	var getUserBySessionToken = function (sessionToken) {
		var user, session;

		session = getUserSessionBySessionToken(sessionToken);
		if (session) {
			user = AuthUsers.findOne({_id: session.user_id});
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
		var sessionToken, hash;

		// Always generate signed token, since we have no way to retrieve
		// it once it has been sent to the client upon login. We only store
		// a hash of this token in the DB for security reasons.
		sessionToken = generateSignedToken();
		hash = getSessionTokenHash(sessionToken);

		AuthUserSessions.insert({
			user_id: user._id,
			hash: hash,
			expires: new Date(Date.now() + settings.sessionLongevitySeconds * 1000).getTime()
		});

		return sessionToken;
	};

	var getSessionTokenForUsernamePassword = function (username, password) {
		var query = {}, user;

		query[settings.usernameField] = username;
		user = AuthUsers.findOne(query);

		if (isUserPasswordCorrect(user, password)) {
			return getSessionTokenForUser(user);
		}
	};

	var clearUserSessions = function (sessionToken) {
		var user = getUserBySessionToken(sessionToken);

		if (user) {
			user = AuthUserSessions.remove({user_id: user._id});
			return true;
		}
	};

	return {
		getSessionTokenForUsernamePassword: getSessionTokenForUsernamePassword,
		clearUserSessions: clearUserSessions,
		getUserBySessionToken: getUserBySessionToken,
		generatePasswordHash: generatePasswordHash,
		isUserPasswordCorrect: isUserPasswordCorrect
	};
};