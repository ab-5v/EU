global.console.debug = function(){console.log.call(null, arguments);}

var Mongolian = require("mongolian");

// Create a server instance with default host and port
var server = new Mongolian();

// Get database
var db = server.db("eu");

module.exports = db;
