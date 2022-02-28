const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    feedId: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 15
    },
    message: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 500
    },
	created_date: {
		type: Date,
		required: true,
	},
	update_date: {
		type: Date,
		required: true,
	},
    isActive: {
        type: Boolean,
        default: false
    },
});

schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

const Post = mongoose.model('Post', schema);

exports.Post = Post; 