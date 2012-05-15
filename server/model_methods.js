/*******************************************
* User model methods
*******************************************/

var insertUser = function (name, username, password) {
	var bcrypt = __meteor_bootstrap__.require("bcrypt");
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password, salt);
	var user_id = Users.insert({name: name, username: username, password_hash: hash});

	return user_id;
};

/*******************************************
* Record model methods
*******************************************/

var insertRecord = function (title, user_id, is_private) {
	var record_id = Records.insert({title: title, user_id: user_id, is_private: is_private});
	return record_id;
};
