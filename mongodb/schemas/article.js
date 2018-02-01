var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ArticleSchema = new Schema({
  title: String,
  sub_title: String,
  content: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

ArticleSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()

  }
  else {
    this.meta.updateAt = Date.now()
  }
  next()
});



ArticleSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort({ '_id': 1 })
      .exec(cb)
  },
  findById: function (id, cb) {
    return this
      .findOne({ _id: id })
      .sort({ '_id': 1 })
      .exec(cb)
  }
};

module.exports = ArticleSchema;