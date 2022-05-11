const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const annualLeaveSchema = new Schema({
    staffId: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    confirm: {
        type: Boolean,
        required: true
    },
    date: {
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
});

// workSchema.methods.addAnnualLeave = function(newReg) {
//     this.annualLeave.anLeReg.push(newReg);
//     this.annualLeave.total -= newReg.reg;
//     this.save();
//     return this;
// }

module.exports = mongoose.model('AnnualLeave', annualLeaveSchema);