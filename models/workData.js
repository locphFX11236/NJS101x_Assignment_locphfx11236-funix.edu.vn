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
    },
    workTime: {
        type: String,
        required: true
    },
    totalWT: {
        type: String,
        required: true
    },
    annuArr: [{
        confirm: {
            type: Boolean,
            required: true
        },
        leaveDate: {
            type: String,
            required: true
        },
        register: {
            type: Number,
            required: true
        },
        reason: {
            type: String,
            required: true
        }
    }],
    countIndex: {
        type: Number,
        required: true
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('WorkData', workDataSchema);