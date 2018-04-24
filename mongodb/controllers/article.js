var mongoose = require('mongoose');
var Article = require('../models/article');
var _ = require('underscore');

exports.new = function (req, res) {
  res.render('newfile', {
    title: '创建文章',
    article: {}
  })
};



// update article  
exports.update = function (req, res) {
  var id = req.params.id;
  if (id) {
    Article.findById(id, function (err, article) {
      res.render('newfile', {
        title: '修改文章',
        article: article
      })
    })
  }
};


exports.save = function (req, res) {
  var id = req.body._id;
  var title = req.body.title;
  var content = req.body.content;
  var articleObj = {
    "title" : title,
    "content" : content
  };
  var _article;
  if (id) {
    Article.findById(id, function (err, article) {
      if (err) {
        console.log(err);
      }
      _article = _.extend(article, articleObj);
      _article.save(function (err, article) {
        if (err) {
          console.log(err);
        }
        res.redirect('/article/detail' + article._id);
      })
    })
  }
  else {
    _article = new Article(articleObj);
    _article.save(function (err, article) {
      if (err) {
        console.log(err);
      }
      res.redirect('/article/detail'+ article._id);
    })
  }
};


exports.detail = function (req, res) {
  var id = req.params.id;
  if (id) {
    Article.update({ _id: id }, { $inc: { pv: 1 }}, function(err) {
      if (err) {
        console.log(err);
      }
    })
    Article.findById(id, function (err, article) {
      if (err) {
        console.log(err);
      }
      res.render('detail', {
        title: article.title,
        content: article.content,
        article: article
      })
    })
  }
};


exports.articleDetail = function (req, res) {
  var id = req.params.id;
  Article.findById(id, function (err, article) {
    if (err) {
      console.log(err);
    }
    res.json({
      article : article
    })
  })
};


exports.blog = function (req, res, next) {
  Article.find({}, function (err, articles) {
    if (err) {
      console.log(err);
    }
    res.render('blog', 
    { 
      title: 'my articles',
      articles: articles
    });
  });
};