var mongoose = require('mongoose')
var Message = require('../models/message');

exports.message = function (req, res) {
  Message.find({}, function (err, messages) {
    if (err) {
      console.log(err);
    }
    res.render('message',
    {
      title: '留言板',
      messages: messages
    });
  });
};

exports.save = function (req, res) {
  var name = req.body.name;
  var content = req.body.content;

  var messageObj = {
    "name": name,
    "content": content
  };

  console.log(messageObj);
  var _message;

  _message = new Message(messageObj);
  _message.save(function(err, message) {
    if (err) {
      console.log(err);
    }
    console.log(err);
    res.redirect('/article/message');
  });

  
};