var Users = new Meteor.Collection("users");
var Notes = new Meteor.Collection("notes");

Meteor.startup(function () {
	initializeSessionToken();
});