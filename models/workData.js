const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workDataSchema = new Schema({
    staff_id: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    deltaWT: {
        type: Number,
        required: true
    },
    annualLeave: {
        type: Number,
        required: true
    },
    totalWorkTime: {
        type: Number,
        required: true
    },
    workTimeList: [ {
        workTime: {
            type: String,
            required: true
        },
        begin: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        },
        at: {
            type: String,
            required: true
        }
    } ],
    regAnnualLeave: [ {
        register: {
            type: Number,
            required: true
        },
        reason: {
            type: String,
            required: true
        }
    } ]
}, {
    timestamps: true,
});

module.exports = mongoose.model('WorkData', workDataSchema);