const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const covidSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    vaccine: [{
        date: {
            type: Date,
            required: true
        },
        typeVac: {
            type: String,
            required: true
        }
    }],
    positive: [{
        date: {
            type: Date,
            required: true
        }
    }],
    temperature: [{
        date: {
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