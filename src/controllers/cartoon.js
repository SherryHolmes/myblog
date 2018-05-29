var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');
var async = require('async');
var mkdirp = require('mkdirp');
var Promise = require("bluebird");
var mongoose = require('mongoose');
var Cartoon = require('../models/cartoon');

// 需要爬的网址
// var baseUrl = 'http://www.kuaikanmanhua.com';

function createDirectory(dir) {
  //创建目录
  mkdirp(dir, function(err) {
    if(err){
      console.log(err);
    }
    else {
      console.log(dir+'文件夹创建成功!');
    }
  });
}

function getUrls() {
  var urls = [];
  var baseUrl = 'http://www.kuaikanmanhua.com/web/comic/';
  for (var i = 89223; i < 89224; i++) {
    var tmp =  baseUrl + i;
    urls.push(tmp);
    var dir='./'+i;

    //创建目录
    mkdirp(dir, function(err) {
      if(err){
        console.log(err);
      }
      else {
        console.log(dir+'文件夹创建成功!');
      }
    });
  }
  return urls;
}

// 抓取网页内容
function fetchUrl(url) {
  var options = {
    url: url,
    headers: {
      "Connection": "keep-alive",
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99"
    }
  };
  console.log('请求url：'+options.url);
  request(options, function (error, response, body) {
    if(error) console.log(error);
    else console.log('成功请求'+options.url);
    if (!error && response.statusCode == 200) {
      acquireData(options.url, body);
    }
  })
}


function acquireData(url, data) {
  var $ = cheerio.load(data);
  var imgs = $(".comic-imgs .kklazy");
  var size = imgs.length;
  console.log('获得:'+size+'张漫画');
  for (var i=1; i<size; i++){
    var imgsrc = $(imgs[i]).attr("data-kksrc");
    console.log(imgsrc);
    var filename = $(imgs[i]).attr("title") + i + ".jpg";  //生成文件名
    downloadImg(imgsrc, filename,'./89223/', function() {
      console.log(filename + ' done');
    });
  }
}


function parseUrlForFileName(address) {
  var filename = path.basename(address);
  return filename;
}


var downloadImg = function(uri, filename, dir, callback){
  request({uri: uri, encoding: 'binary'},
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      if(!body){
        callback("(╥╯^╰╥)哎呀没有内容。。。", null);
        console.log("(╥╯^╰╥)哎呀没有内容。。。")
      }
      fs.writeFile(dir+filename, body, 'binary', function (err) {
        if (err) {
          console.log(err);
        }
        console.log('下载'+dir+'/'+ filename + ' done');
        callback(null, '下载'+dir+'/'+ filename + ' done');
      });
    }
  });
};


function getUrlsList() {
  return new Promise(function (resolve, reject) {
    var baseUrl = 'http://www.kuaikanmanhua.com';
    var urls = [];
    var options = {
      url: baseUrl,
      headers: {
        "Connection": "keep-alive",
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99"
      }
    };
    console.log('请求url：'+ options.url);
    request(options, function (error, response, body) {
      if(error) {
        console.log(error);
      }
      else {
        console.log('成功请求'+options.url);
      }
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        var imgs = $(".daily-recommend .comic-img > a");
        var imgurls = $(".daily-recommend .comic-img > a .kklazy");
        var size = imgs.length;
        for (var i=1; i<size; i++){
          var url = $(imgs[i]).attr("href");
          var title = $(imgs[i]).attr("title");
          var imgurl = $(imgurls[i]).attr("data-kksrc");
          urls.push({
            url : url,
            title: title,
            imgurl: imgurl
          });
          if ( i === (size-1) ) {
            resolve(urls);
          }
        }
      }
    })
  })
}

exports.detail = function (req, res) {
  var url = urls + "/" + id;
  async.eachSeries(url, function (_url, callback) {
    fetchUrl(_url, callback);
  },
  function (err, result) {
    console.log('等待下载。。。');
    res.render('cartoonlist', {
      title: '漫画'
    })
  });
};


exports.list = function (req, res) {
  var _urls;
  var list = [];
  getUrlsList()
  .then(function(urls) {
    _urls = urls;
    var dir = "./public/cartoon/imglist";
    createDirectory(dir);
  })
  .then(function() {
    Promise.map(_urls, function(url, index){
      downloadImg(url.imgurl,  index + ".jpg", "./public/cartoon/imglist/", function(){
        list.push({
          url: url.url, 
          name:  index + ".jpg",
          title: url.title
        })
        if( list.length === _urls.length) {
          console.log(list);
          res.render('cartoonlist', {
            title: '漫画列表',
            urls: list
          })
        }
      })
    })
  })
}