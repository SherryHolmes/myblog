var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CartoonSchema = new Schema({
  title: String,
  name: String,
  url: String,
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

CartoonSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()

  }
  else {
    this.meta.updateAt = Date.now()
  }
  next()
});



CartoonSchema.statics = {
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

module.exports = CartoonSchema;