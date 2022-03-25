const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const covidSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    vaccine: [{
        dateVac: {
            type: Date,
            required: true
        },
        typeVac: {
            type: String,
            required: true
        }
    }],
    datePositive: [{
        type: Date,
        required: true
    }],
    tempBody: [{
        dateTemp: {
            type: Date,
            required: true
        },
        temp: {
            type: Number,
            required: true
        }
    }]
});

module.exports = mongoose.model('Covid', covidSchema);