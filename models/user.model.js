const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    lastname: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true
    },
    interests: {
        type: Array,
        minlength: 3,
        maxlength: 255,
        required: true
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 1024,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: true
    },
	created_date: {
		type: Date,
		required: true,
        default: Date.now()
	},
	update_date: {
		type: Date,
		required: true,
        default: Date.now()
	},
})

userSchema.method('toJson',function() {
    const {__v, _id, ...object } = this.toObject();
    object.id = _id;
    return object
});

userSchema.methods.generateToken = function() {
    const token = jwt.sign({ id: this.id, isVerified: this.isVerified, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'))
    return token;
}

const User = mongoose.model('User', userSchema);

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now(),
        index: {
            expires: 86400000
        }
    }
})

userSchema.method('toJson',function() {
    const {__v, _id, ...object } = this.toObject();
    object.id = _id;
    return object
});

const Token = mongoose.model('Token', tokenSchema);

exports.User = User;
exports.Token = Token;