var express = require('express');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var multipart = require('connect-multiparty');
var logger = require('morgan');
var serveStatic = require('serve-static');
var app = express();

/** mongoose */
var dbUrl = 'mongodb://localhost/db';
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);


// view engine setup
app.set('views', path.join(__dirname, './mongodb/views/pages'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(multipart());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(cookieSession({
  secret: 'db',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  }),
  resave: false,
  saveUninitialized: false
}));

require('./routes/routes')(app);
// models loading
var models_path = __dirname + '/mongodb/models';

var walk = function (path) {
  fs
    .readdirSync(path)
    .forEach(function (file) {
      var newPath = path + '/' + file;
      var stat = fs.statSync(newPath);

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
};
walk(models_path);




// app.use(express.session({
//   secret: 'db',
//   saveUninitialized: false, // don't create session until something stored
//   resave: false, //don't save session if unmodified
//   store: new MongoStore({
//     url: 'mongodb://localhost/test-app',
//     touchAfter: 24 * 3600 // time period in seconds
//   })
// }));

// //增加一些debug信息供调试
// var env = process.env.NODE_ENV || 'development';
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });


// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   // res.locals.error = req.app.get('env') === 'development' ? err : {};
//   if ('development' === env) {
//     app.set('showStackError', true);
//     app.use(logger(':method :url :status'));
//     app.locals.pretty = true;//网页源代码格式化
//     mongoose.set('debug', true)  //数据库debug信息
//   }
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });



//增加一些debug信息供调试
var env = process.env.NODE_ENV || 'development';
if ('development' === env) {
  app.set('showStackError', true);
  app.use(logger(':method :url :status'));
  app.locals.pretty = true;//网页源代码格式化
  mongoose.set('debug', false)  //数据库debug信息
}

module.exports = app;
