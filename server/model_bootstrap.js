Meteor.startup(function () {

	var mat = Users.findOne({name: "Mathieu"});
	var jon = Users.findOne({name: "Jon"});

	if (mat === undefined) {
		mat = Users.findOne({_id: insertUser("Mathieu", "mat", "password")});
	}

	if (jon === undefined) {
		jon = Users.findOne({_id: insertUser("Jon", "jon", "password2")});
	}

	if (Records.find().count() === 0) {
		insertRecord("Mat's private record #1", mat._id, true);
		insertRecord("Mat's private record #2", mat._id, true);
		insertRecord("Mat's public record", mat._id, false);

		insertRecord("Jon's private record", jon._id, true);
		insertRecord("Jon's public record #1", jon._id, false);
		insertRecord("Jon's public record #2", jon._id, false);
		insertRecord("Jon's public record #3", jon._id, false);
	}
});