var db = require('./db').db;
var Item = require('./item').Item;
var ObjectID = require('mongodb').BSONNative.ObjectID;

module.exports.Group = Object.create(Item, {collection: {value: 'groups'}});
