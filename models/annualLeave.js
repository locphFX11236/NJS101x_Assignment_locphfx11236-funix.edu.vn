const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const annualLeaveSchema = new Schema({
    staff_id: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    annualLeave: {
        type: Number,
        required: true
    },
    regInformation: [{
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
    }]
});

annualLeaveSchema.methods.addToAnnu = function(reg) {
    this.regInformation.push(reg);
    this.annualLeave -= reg.register;
    return this.save();
}

module.exports = mongoose.model('AnnualLeave', annualLeaveSchema);