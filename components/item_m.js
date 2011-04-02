var db = require('./db_mongolian');

module.exports.Item = Object.create({}, {
    collection: {
        get: function() {
            console.log(this._collection);
            if (typeof this._collection === 'string') {
                try{
                this._collection = db.collection(this._collection);
}catch(e){console.log(e);}
                console.log(db.collection(this._collection), this._collection);
            }
            return this._collection;
        }
    },
    add: function(item, callback){
        this.collection.insert(item, callback);
    },
    remove: function(id, callback){
        this.collection.remove({_id: db.ObjectID.createFromHexString(id)}, callback);
    }
});
