var Index = require('../mongodb/controllers/index');
var Article = require('../mongodb/controllers/article');
var User = require('../mongodb/controllers/user');
var Message = require('../mongodb/controllers/message');

module.exports = function (app) {
  // pre handle user 预处理
  app.use(function (req, res, next) {
    var _user = req.session.user;
    app.locals.user = _user;
    next();
  });

  //Index
  app.get('/', Index.index);
  app.get('/enjoy', Index.enjoy);
  app.get('/test', Index.test);
  app.get('/test_page', Index.test_page);
  app.get('/force', Index.force);

  // article
  app.get('/article/update/id', User.loginRequired, User.adminRequired, Article.update);
  app.get('/article/new', User.loginRequired, User.adminRequired, Article.new);
  app.post('/article', User.loginRequired, User.adminRequired, Article.save);
  app.get('/article/detail:id', Article.detail);
  app.get('/blog', Article.blog);
  app.get('/articleDetail/id', Article.articleDetail);

  // User
  app.post('/user/logup', User.logup);
  app.post('/user/login', User.login);
  app.get('/login', User.showLogin);
  app.get('/logup', User.showLogup);
  app.get('/logout', User.logout);
  app.get('/sign/logout', User.signlogout);
  app.get('/admin/user/list', User.loginRequired, User.adminRequired, User.list);

  // Message
  app.post('/message', User.loginRequired, Message.save);
  app.get('/article/message', Message.message);

};
