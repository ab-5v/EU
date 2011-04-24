var db = require('../components/db');

module.exports = function(app){
app.get('/', function(req, res){
    res.render('index', {
        title: 'EU'
    });
});
app.get('/mongolian', function(req, res){
    var users = db.collection("users");
    var r = function(d, p){p.count++;}
    db.queryCommand({group: {
        ns: "user",
        key: {name: 1},
        initial: {count: 0},
        $reduce: r
    }}, console.log);

    /*
    users.find().toArray(function(){
        res.header('Content-Type', 'application/javascript; charset=utf-8');
        res.send(arguments[1]);
    })
    */
});
};
