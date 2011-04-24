module.exports = function(req, res, view, data){
    if (req.param('json')) {
        res.header('Content-Type', 'application/javascript; charset=utf-8');
        res.send(data);
    } else {
        res.render('admin/index', data);
    }
}
