var User = require('../components/user').User;
var Group = require('../components/group').Group;
var Event = require('../components/event').Event;
var render = require('../middleware/render');
var cert = require('../helper/cert').Cert;

module.exports = function(app){

app.get('/admin', function(req, res){
    User.getAll(function(errors, data){
        render(req, res, 'admin/index', {
            title: 'Admin',
            users: data.users,
            groups: data.groups,
            events: data.events
        });
    });
});
app.post('/admin/adduser', function(req, res){
    User.add(
        {
            name: req.param('name'),
            group: req.param('group')
        },
        function(err, data){
            cert.create(data._id);
            res.redirect('/admin')
        }
    );
});
app.post('/admin/addgroup', function(req, res){
    Group.add(
        {
            name: req.param('name')
        },
        function(err, data){
            res.redirect('/admin')
        }
    );
});
app.post('/admin/addevent', function(req, res){
    Event.add(
        {
            name: req.param('name')
        },
        function(){
            res.redirect('/admin')
        }
    );
});
app.get('/admin/removeuser', function(req, res){
    var uid = req.param('id');
    User.remove(
        uid,
        function(){
            cert.revoke(uid);
            res.redirect('/admin');
        }
    );
});
app.get('/admin/revokeuser', function(req, res){
    var uid = req.param('id');
    cert.revoke(uid, function(){
        cert.create(uid);
        res.redirect('/admin');
    });
});
app.get('/admin/removegroup', function(req, res){
    Group.remove(
        req.param('id'),
        function(){
            res.redirect('/admin')
        }
    );
});
app.get('/admin/removeevent', function(req, res){
    Event.remove(
        req.param('id'),
        function(){
            res.redirect('/admin')
        }
    );
});
};
