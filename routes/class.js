module.exports = function(app){

app.get('/class', function(req, res){
    euAdmin.getUsers(function(errors, data){
        res.render('class/index', {
            title: 'Class',
            users: data.users,
            groups: data.groups
        });
    });
});
};
