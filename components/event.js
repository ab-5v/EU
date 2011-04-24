var db = require('../middleware/db').db;
var Item = require('./item').Item;

module.exports.Event = Object.create(Item, {_collection: {value: 'events', writable: true}});
