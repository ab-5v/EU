module.exports = function(app){
app.get('/', function(req, res){
    var subj = req.header && req.headers['x-ssl-subject'];
    res.render('index', {
        title: 'EU',
        subj: subj
    });
});
};
