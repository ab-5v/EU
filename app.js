/**
 * Module dependencies.
 */
var express = require('express');
var app = express.createServer();

// Configuration
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({secret: 'pass'}));
    app.use(app.router);
    app.use(express.static(__dirname + '/static'));
    app.use(express.static(__dirname + '/cert/users'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

// Routes
require('./routes/index')(app);
require('./routes/class')(app);
require('./routes/admin')(app);

if (!module.parent) {
  app.listen(3001);
  console.log("Express server listening on port %d", app.address().port)
}
