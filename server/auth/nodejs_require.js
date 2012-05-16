var require = function (name) {
	var path = __meteor_bootstrap__.require("path");
	var fs = __meteor_bootstrap__.require("fs");
	var modulePath = "node_modules/" + name;
	var basePath = path.resolve(".");
	var publicPath;
	var staticPath;

	if (basePath === "/") {
		basePath = path.dirname(global.require.main.filename);
	}

	publicPath = path.resolve(basePath + "/public/" + modulePath);
	staticPath = path.resolve(basePath + "/static/" + modulePath);

	if (path.existsSync(publicPath)) {
		return __meteor_bootstrap__.require(publicPath);
	} else if (path.existsSync(staticPath)) {
		return __meteor_bootstrap__.require(staticPath);
	} else {
		throw "node_modules not found";
	}
};