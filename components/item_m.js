var db = require('./db_mongolian');
var ObjectID = require('mongodb').BSONNative.ObjectID;

module.exports.Item = Object.create({}, {
    collection: {
        get: function() {
            if (typeof this._collection === 'string') {
                this._collection = db.collection(this._collection);
            }
            return this._collection;
        }
    },
    add: {
        value: function(item, callback){
            this.collection.insert(item, callback);
        }
    },
    remove: {
        value: function(id, callback){
            this.collection.remove({_id: ObjectID.createFromHexString(id)}, callback);
        }
    }
});
