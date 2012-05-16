var Auth;

Meteor.startup(function () {

	// Setup global Auth object, which holds various methods to manage
	// authentication. Parameters allow you to customize which collection and
	// fields should be managed.
	Auth = auth(Users, "username", "password_hash", "session_token");

	// Lock down various collections so as to prevent clients from modifying
	// them directly. We use the methods in rpc-endpoints.js to modify
	// collections, which are exposed carefully via Meteor.methods().
	Meteor.default_server.method_handlers["/users/insert"] = function() {};
	Meteor.default_server.method_handlers["/users/update"] = function() {};
	Meteor.default_server.method_handlers["/users/remove"] = function() {};
	Meteor.default_server.method_handlers["/notes/insert"] = function() {};
	Meteor.default_server.method_handlers["/notes/update"] = function() {};
	Meteor.default_server.method_handlers["/notes/remove"] = function() {};

	// Bootstrap database with sample data (if empty)
	bootstrap();
});