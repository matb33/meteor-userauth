/**
	Lock down various collections so as to prevent clients from modifying them
	directly. We use the methods in server_methods.js to modify collections,
	which are exposed carefully via Meteor.methods.
*/

Meteor.startup(function () {
	// Lock down Users
	Meteor.default_server.method_handlers["/users/insert"] = function() {};
	Meteor.default_server.method_handlers["/users/update"] = function() {};
	Meteor.default_server.method_handlers["/users/remove"] = function() {};

	// Lock down Records
	Meteor.default_server.method_handlers["/records/insert"] = function() {};
	Meteor.default_server.method_handlers["/records/update"] = function() {};
	Meteor.default_server.method_handlers["/records/remove"] = function() {};
});