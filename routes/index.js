var db = require('../components/db_mongolian');

module.exports = function(app){
app.get('/', function(req, res){
    res.render('index', {
        title: 'EU'
    });
});
app.get('/mongolian', function(req, res){
    var users = db.collection("users");
    users.find().toArray(function(){
        res.header('Content-Type', 'application/javascript; charset=utf-8');
        res.send(arguments[1]);
    })
});
};
