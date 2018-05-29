var mongoose = require('mongoose');
var CartoonSchema = require('../schemas/cartoon');
var Cartoon = mongoose.model('Cartoon', CartoonSchema);

module.exports = Cartoon;
