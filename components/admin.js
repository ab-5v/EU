var Db = require('mongodb').Db,
  Server = require('mongodb').Server,
  ObjectID = require('mongodb').ObjectID;

euAdmin = function(host, port) {
  this.db = new Db('eu', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

euAdmin.prototype.getCollection = function(name, callback) {
    this.db.collection(name, function(error, users) {
        if(error){
            callback(error);
        } else {
            callback(null, users);
        }
    });
};

euAdmin.prototype.getUsers = function(callback) {
    var _this = this;
    this.getCollection('users', function(error, users) {
        if (error) {
            callback(error);
        } else {
            users.find({}, {}, function(error, cursor) {
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
};

euAdmin.prototype.findById = function(id, callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
        article_collection.findOne({_id: ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

euAdmin.prototype._removeItem = function(name, id, callback) {
    this.getCollection(name, function(error, items) {
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
};

euAdmin.prototype.removeUser = function(id, callback){
    this._removeItem('users', id, callback);
}
euAdmin.prototype.removeGroup = function(id, callback){
    this._removeItem('groups', id, callback);
}
euAdmin.prototype._addItem = function(name, item, callback) {
    this.getCollection(name, function(error, items) {
        if (error) {
            callback(error);
        }
        else {
            items.insert(item, function() {
                callback(null, items);
            });
        }
    });
}
euAdmin.prototype.addUser = function(user, callback) {
    this._addItem('users', user, callback);
};

euAdmin.prototype.addGroup = function(group, callback) {
    this._addItem('groups', group, callback);
};

module.exports.euAdmin = euAdmin;
