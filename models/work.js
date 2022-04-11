const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    month: {
        type: String,
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
    working: [ {
        date: {
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
    } ]
});

workSchema.methods.editWork = function(newWorking, dateWork) {
    if (this.working[0].end !== 'Chưa ghi nhận!') { // Tạo mới phiên
        if (this.working[0].date !== dateWork) {
            this.working.unshift(newWorking);
            this.working[1].state = false;
            this.working[0].workTime = '00:00' + '/' + this.working[1].workTime.slice(-5);
        } else {
            this.working.unshift(newWorking);
        }
    } else { // Nếu phiên làm việc đã đc tạo trước đó
        this.working[0] = newWorking;
    }
    this.save();
    return this;
};

workSchema.methods.addAnnualLeave = function(newReg) {
    this.annualLeave.anLeReg.push(newReg);
    this.annualLeave.total -= newReg.reg;
    this.save();
    return this;
}

module.exports = mongoose.model('Work', workSchema);