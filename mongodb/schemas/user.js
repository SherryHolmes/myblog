var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');//需要npm install bcrypt-nodejs --save-dev
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
	name: {				//登录名
		unique: true,
		type: String
	},
	password: String,  //登陆密码
	//角色 权限 user admin root
	// 0: nomal user
	// 1: verified user
	// 2: professinal user
	// >10:admin
	// >50:root
	role: {
		type:Number,
		default: 0
		},
	meta: {						//创建网页的时间记录
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

UserSchema.pre('save', function (next) {
	var user = this;

	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else{
		this.meta.updateAt = Date.now()
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);

		//新版本的bcrypt-nodejs需要四个参数
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) return next(err);
			user.password = hash;
			next()
		})
	})
});


UserSchema.methods = {
	comparePassword: function(_password, cb) {
		bcrypt.compare(_password, this.password, function(err, isMatch) {
			if (err) return cb(err);
			
			cb(null, isMatch)
		})
	}
};

UserSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
    findById: function(id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb)
	}
};

module.exports = UserSchema;