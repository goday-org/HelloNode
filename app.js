
/**
 * Module dependencies.
 */

var flash = require("connect-flash") 
  ,express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , MongoStore = require("connect-mongo")(express)
  , settings = require("./settings");

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
secret: settings.cookieSecret,
store: new MongoStore({
db: settings.db
})}));
app.use(flash());

app.use(function(req, res, next){
    //current user
    res.locals.user = req.session.user;
    
    //error message
    var err = req.flash('error');
    if(err.length)  
        res.locals.error = err;
    else
        res.locals.error = null;
        
    //success message
    var succ = req.flash('success');
    if(succ.length) 
        res.locals.success = succ;
    else 
        res.locals.success = null;
        
    next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
routes(app);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
