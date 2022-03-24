const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const checkSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    }
});

module.exports = mongoose.model('Check', checkSchema);