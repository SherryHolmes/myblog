var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = router.get('/', function(req, res, next) {
  res.render('index', { title: 'SherryHolmes主页' });
});

/* GET enjoy page. */
module.exports = router.get('/enjoy', function(req, res, next) {
  res.render('enjoy', { title: '美句欣赏页' });
});

/* GET force page. */
module.exports = router.get('/force', function(req, res, next) {
  res.render('force', { title: '力导向图页' });
});

/* GET users listing. */
module.exports = router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET test page. */
module.exports = router.get('/test', function (req, res, next) {
  res.render('test', { title: 'test' });
});

