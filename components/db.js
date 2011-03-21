var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

module.exports.db = (function(){
    var db = new Db('eu', new Server('localhost', 27017, {auto_reconnect: true}, {}));
    db.open(function(){});
    console.log('db connector');
    return db;
})();
