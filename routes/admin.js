var User = require('../components/user_m').User;
var Group = require('../components/group').Group;
var Event = require('../components/event').Event;
var render = require('../components/render');

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
        function(){
            res.redirect('/admin')
        }
    );
});
app.post('/admin/addgroup', function(req, res){
    Group.add(
        {
            name: req.param('name')
        },
        function(){
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
    User.remove(
        req.param('id'),
        function(){
            res.redirect('/admin')
        }
    );
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
