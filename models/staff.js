const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const staffSchema = new Schema({
    imageUrl: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    doB: {
        type: Date,
        required: true
    },
    salaryScale: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    annualLeave: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Staff', staffSchema);