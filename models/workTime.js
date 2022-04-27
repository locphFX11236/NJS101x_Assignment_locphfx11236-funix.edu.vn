const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workTimeSchema = new Schema({
    _id: {
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
});

// workSchema.methods.editWork = function(newWorking, dateWork) {
//     if (this.working[0].end !== 'Chưa ghi nhận!') { // Tạo mới phiên
//         if (this.working[0].date !== dateWork) {
//             this.working.unshift(newWorking);
//             this.working[1].state = false;
//             this.working[0].workTime = '00:00' + '/' + this.working[1].workTime.slice(-5);
//         } else {
//             this.working.unshift(newWorking);
//         }
//     } else { // Nếu phiên làm việc đã đc tạo trước đó
//         this.working[0] = newWorking;
//     }
//     this.save();
//     return this;
// };

module.exports = mongoose.model('WorkTime', workTimeSchema);