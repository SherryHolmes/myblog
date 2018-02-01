var mongoose = require('mongoose')
var User = require('../models/user');

//showLogin
exports.showLogin = function(req, res) {
  var _user = req.session.user;

  if (_user)
  {
    User.findOne({name: _user.name}, function(err, user) {
      if (err) {
        console.log(err);
      }
      if (user) {
        res.render('login', {
          title: '登录页面',
          user : user
        })
      }
      else
      {
        res.render('login', {
          title: '登录页面',
        })
      }
    });
  }
  else
  {
    res.render('login', {
      title: '登录页面',
    })
  }
};

//showLogup
exports.showLogup = function(req, res) {
  var _user = req.session.user;

  if (_user)
  {
    User.findOne({name: _user.name}, function(err, user) {
      if (err) {
        console.log(err);
      }
      if (user) {
        res.render('login', {
          title: '登录页面',
          user : user
        })
      }
      else
      {
        res.render('login', {
          title: '登录页面',
        })
      }
    });
  }
  else
  {
    res.render('logup', {
      title: '注册',
    })
  }
};

//user logup  /user/logup
exports.logup = function(req, res) {
  var name = req.body.name;
  var password = req.body.password;
  var userObj = {
    name: name,
    password: password
  }
  User.findOne({name : name}, function(err, user) {
    if (err) {
      console.log(err);
    }
    if (user) {
      return res.redirect('/login')
    }
    else {
      user = new User(userObj);
      user.save(function(err, user) {
        if(err) {
          console.log(err);
        }
        res.redirect('/')
      })
    }
  }) 
};

//user login  /user/login
exports.login = function(req, res) {
  // var _user = req.body.user;
  var name = req.body.name;
  var password = req.body.password;

  User.findOne({name: name}, function(err, user) {
    if (err) {
      console.log(err);
    }
    if (!user) {
      return res.redirect('/logup')
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log(err);
      }
      if (isMatch) {
        req.session.user = user
        return res.redirect('/')
      }
      else{
        return res.redirect('/login')
      }
    })
  })
};

//user logout  /logout
exports.logout = function(req, res) {
	delete req.session.user;
	// delete app.locals.user
	res.redirect("/");
};

//user logout  /logout
exports.signlogout = function(req, res) {
  delete req.session.user;
  // delete app.locals.user
  res.redirect("/login");
};
 
// userlist page  /admin/userlist
exports.list = function(req, res) {
  User.fetch(function(err, users) {
    if(err) {
      console.log(err);
    }
    res.render('userlist', {
      title: '用户列表页',
      users: users
    })
  })
};


// midware for user loginRequired 中间件权限控制
exports.loginRequired = function(req, res, next) {
  var user = req.session.user;
  if (!user) {
    return res.redirect('/login')
  }
  next()
};

// midware for user adminRequired 中间件权限控制
exports.adminRequired = function(req, res, next) {
  var user = req.session.user;
  if (user.role <= 10) {
    return res.redirect('/login')
  }
  next()
};