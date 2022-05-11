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
    },
    managerId: {
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

module.exports = mongoose.model('Staff', staffSchema);