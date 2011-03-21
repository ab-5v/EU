var db = require('./db').db;
var Item = require('./item').Item;
var ObjectID = require('mongodb').BSONNative.ObjectID;

module.exports.User = Object.create(Item, {
    collection: {
        value: 'users',
    },
    getAll: {
        value: function(callback){
            var _this = this;
            this.getCollection(function(error, users) {
                if (error) {
                    callback(error);
                } else {
                    users.find({}, function(error, cursor) {
                        if (error) {
                            callback(error);
                        } else {
                            cursor.toArray(function(error, rUsers) {
                                if (error) {
                                    callback(error);
                                } else {
                                    _this.getCollection('groups', function(error, groups){
                                        if (error) {
                                            callback(error);
                                        } else {
                                            groups.find({}, function(error, cursor){
                                                cursor.toArray(function(error, rGroups){
                                                    if (error) {
                                                        callback(error);
                                                    } else {
                                                        callback(null, {users: rUsers, groups: rGroups});
                                                    }
                                                });
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }
});
