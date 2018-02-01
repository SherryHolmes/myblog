var mongoose = require('mongoose');

/* GET home page. */
exports.index = function (req, res, next) {
  res.render('index', { title: 'SherryHolmes主页' });
};

/* GET enjoy page. */
exports.enjoy = function (req, res, next) {
  res.render('enjoy', { title: '美句欣赏页' });
};

/* GET force page. */
exports.force = function (req, res, next) {
  res.render('force', { title: '力导向图页' });
};

exports.test_page = function (req, res, next) {
  res.render('test-page', { title: '测试页面' });
};

/* GET test page. */
exports.test = function (req, res, next) {
  res.render('test', { title: 'test' });
};
