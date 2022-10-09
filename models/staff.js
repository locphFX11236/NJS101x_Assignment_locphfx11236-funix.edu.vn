const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const staffSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    doB: {
        type: String,
        required: true
    },
    salaryScale: {
        type: Number,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    annualLeave: {
        type: Number,
        required: true
    },
    managerId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Staff', staffSchema);