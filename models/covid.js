const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const covidSchema = new Schema({
    staff_id: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    vaccine: [{
        dateVac: {
            type: String,
            required: true
        },
        typeVac: {
            type: String,
            required: true
        }
    }],
    datePositive: [{
        type: String,
        required: true
    }],
    tempBody: [{
        dateTemp: {
            type: String,
            required: true
        },
        temp: {
            type: Number,
            required: true
        }
    }]
});

module.exports = mongoose.model('Covid', covidSchema);