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
var ejs = require('ejs');
var app = express();
app.locals.moment = require('moment');
/** mongoose */
var dbUrl = 'mongodb://localhost/db';
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);


// view engine setup
app.set('views', path.join(__dirname, './public/pages'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');
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
var models_path = __dirname + '/src/models';

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

//增加一些debug信息供调试
var env = process.env.NODE_ENV || 'development';
if ('development' === env) {
  app.set('showStackError', true);
  app.use(logger(':method :url :status'));
  app.locals.pretty = true;//网页源代码格式化
  mongoose.set('debug', false)  //数据库debug信息
}

module.exports = app;
