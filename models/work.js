const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    annualLeave: {
        total: {
            type: Number,
            required: true
        },
        anLeReg: [ {
            date: {
                type: String,
                required: true
            },
            reg: {
                type: Number,
                required: true
            },
            LD: {
                type: String,
                required: true
            }
        } ]
    },
    working: [{
        dateWork: {
            type: String,
            required: true
        },
        state: {
            type: Boolean,
            required: true
        },
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
    }]
});

workSchema.methods.editWorking = function(newWorking) {
    const dateWorkingIndex = this.working.findIndex(dw => {
        return dw.dateWork.toString() === newWorking.dateWork.toString();
    });
    if (dateWorkingIndex >= 0) { // Nếu working đã đc tạo trước đó
        this.working[dateWorkingIndex] = newWorking;
    } else { // Nếu working chưa đc tạo trước đó
        this.working.unshift(newWorking);
        this.working[1].state = false;
    }
    return this.save();
};

workSchema.methods.addAnnualLeave = function(newReg) {
    const dateIndex = this.annualLeave.anLeReg.findIndex(di => {
        return di.date.toString() === newReg.date.toString();
    });
    if (dateIndex >= 0) { // Nếu annualLeave.anLeReg đã đc tạo trước đó
        this.annualLeave.anLeReg[dateIndex].reg += newReg.reg;
    } else { // Nếu annualLeave.anLeReg chưa đc tạo trước đó
        this.annualLeave.anLeReg.unshift(newReg);
    }
    this.annualLeave.total -= newReg.reg;
    return this.save();
}

module.exports = mongoose.model('Work', workSchema);