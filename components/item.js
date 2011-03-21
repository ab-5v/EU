var db = require('./db').db;
var ObjectID = require('mongodb').BSONNative.ObjectID;

module.exports.Item = {
    collection: '',
    getCollection: function(collection, callback){
        if (typeof collection === 'function') {
            callback = collection;
            collection = this.collection;
        }
        db.collection(collection, function(error, items) {
            if(error){
                callback(error);
            } else {
                callback(null, items);
            }
        });
    },
    add: function(item, callback){
        console.log(this.collection, item);
        this.getCollection(function(error, items) {
            if (error) {
                callback(error);
            }
            else {
                items.insert(item, function() {
                    callback(null, items);
                });
            }
        });
    },
    remove: function(id, callback){
        this.getCollection(function(error, items) {
            if (error) {
                callback(error);
            } else {
                items.remove({_id: ObjectID.createFromHexString(id)}, function(error, result) {
                    if (error) {
                        callback(error);
                    } else {
                        callback(null, result);
                    }
                });
            }
        });
    }
};
