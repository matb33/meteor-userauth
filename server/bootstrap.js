var bootstrap = function () {
	var mat = Users.findOne({username: "mathieu"});
	var jon = Users.findOne({username: "jon"});
	var darren = Users.findOne({username: "darren"});

	if (mat === undefined) {
		mat = Users.findOne({_id: insertUser("Mathieu Bouchard", "mathieu", "password")});
	}

	if (jon === undefined) {
		jon = Users.findOne({_id: insertUser("Jon Eng", "jon", "password")});
	}

	if (darren === undefined) {
		darren = Users.findOne({_id: insertUser("Darren Schnare", "darren", "password")});
	}

	if (Notes.find().count() === 0) {
		insertNote("Mat's private note #1", mat._id, true);
		insertNote("Mat's private note #2", mat._id, true);
		insertNote("Mat's public note", mat._id, false);

		insertNote("Jon's private note", jon._id, true);
		insertNote("Jon's public note #1", jon._id, false);
		insertNote("Jon's public note #2", jon._id, false);
		insertNote("Jon's public note #3", jon._id, false);

		insertNote("Darren's private note", darren._id, true);
		insertNote("Darren's public note", darren._id, false);
	}
};