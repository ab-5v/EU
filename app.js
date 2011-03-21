
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();
var euAdmin = require('./components/admin').euAdmin;
var euAdmin = new euAdmin('localhost', 27017);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/static'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    locals: {
      title: 'EU'
    }
  });
});

app.get('/admin', function(req, res){
    euAdmin.getUsers(function(errors, data){
        res.render('admin', {
            locals: {
                title: 'Admin',
                users: data.users,
                groups: data.groups
            }
        });
    });
});

app.post('/admin/adduser', function(req, res){
    euAdmin.addUser(
        {
            name: req.param('name'),
            group: req.param('group')
        },
        function(){
            res.redirect('/admin')
        }
    );
});
app.post('/admin/addgroup', function(req, res){
    euAdmin.addGroup(
        {
            name: req.param('name')
        },
        function(){
            res.redirect('/admin')
        }
    );
});


if (!module.parent) {
  app.listen(3001);
  console.log("Express server listening on port %d", app.address().port)
}
