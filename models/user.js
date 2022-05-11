const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    staffId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isManager: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);