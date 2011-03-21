var euAdmin = new (require('../components/admin').euAdmin)('localhost', 27017);

module.exports = function(app){

app.get('/admin', function(req, res){
    euAdmin.getUsers(function(errors, data){
        res.render('admin/index', {
            title: 'Admin',
            users: data.users,
            groups: data.groups
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
app.get('/admin/removeuser', function(req, res){
    euAdmin.removeUser(
        req.param('id'),
        function(){
            res.redirect('/admin')
        }
    );
});
app.get('/admin/removegroup', function(req, res){
    euAdmin.removeGroup(
        req.param('id'),
        function(){
            res.redirect('/admin')
        }
    );
});
};
