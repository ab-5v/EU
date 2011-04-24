var db = require('./db');
var Item = require('./item').Item;

module.exports.User = Object.create(Item, {
    _collection: {
        value: 'users',
        writable: true
    },
    getAll: {
        value: function(callback){
            var _this = this;
            this.collection.find().toArray(function(err, users){
                db.collection('groups').find().toArray(function(err, groups){
                    db.collection('events').find().toArray(function(err, events){
                        callback(null, {users: users, groups: groups, events: events});
                    });
                });
            });
        }
    }
});
