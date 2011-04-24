var Mongolian = require("mongolian");

var server = new Mongolian();

// Get database
var db = server.db("eu");
db.id = require('mongodb').BSONPure.ObjectID;

module.exports = db;
