const WorkTime = require('../models/workTime');
const AnnualLeave = require('../models/annualLeave');
const handle = require('../models/handle');

let i;

exports.getIndex = (req, res, next) => {
    const staff_id = req.params.staff_id;
    const user = req.session.user;
    const dateWork = handle.handleTime.D_M_YPrint();

    // Làm sạch data
    WorkTime
        .find({ 'staff_id': staff_id })
        .then(workTimes => {
            i = workTimes.length - 1; // index phiên cuối
            if (workTimes[i].date !== dateWork) { // Nếu chưa có phiên ngày hôm nay thì tạo phiên ngày hôm nay
                // Nếu phiên trước chưa kết thúc phiên thì không tính worktime
                if (workTimes[i-1].state === true) {workTimes[i-1].state = false};
                // Nếu phiên trước không làm việc thì xóa phiên
                if (workTimes[i-1].workTime === '00:00') {workTimes.splice(i-1,1)};
                workTimes[i-1].save();
            };
            return workTimes;
        })
        .then(result => {
            console.log('CLEAR DATA!')
            return result;
        })
        .catch(err => {
            console.error('CLEAR DATA! ERROR:', err);
        })
    ;

    // Render dữ liệu ra giao diện
    return WorkTime
        .find({ $and: [
            { 'staff_id': staff_id },
            { 'date': dateWork }
        ] })
        .populate('staff_id', 'name')
        .then(workTimes => {
            i = workTimes.length - 1; // index phiên cuối
            if (i < 0) { // Nếu chưa có phiên ngày hôm nay thì tạo phiên ngày hôm nay
                const newWorkTime = new WorkTime ({
                    'staff_id': staff_id,
                    'confirm': false,
                    'date': dateWork,
                    'state': false,
                    'workTime': '00:00',
                    'begin': 'Chưa ghi nhận!',
                    'end': 'Chưa ghi nhận!',
                    'at': 'Công ty',
                    '__v': 0
                });
                newWorkTime.save();
                workTimes.push(newWorkTime);
            } else if (workTimes[i].__v === 1) { // Nếu đã kết thúc phiên trước thì tạo phiên mới
                const newWorkTime = new WorkTime ({
                    'staff_id': staff_id,
                    'confirm': false,
                    'date': dateWork,
                    'state': false,
                    'workTime': workTimes[i].workTime,
                    'begin': 'Chưa ghi nhận!',
                    'end': 'Chưa ghi nhận!',
                    'at': 'Công ty',
                    '__v': 0
                });
                newWorkTime.save();
                workTimes.push(newWorkTime);
            };
            return workTimes;
        })
        .then(workTimes => {
            i = workTimes.length - 1;
            const name = workTimes[i].staff_id.name; // Lỗi không đồng bộ in ra name
            return res.render(
                'MH-1_1', // Đến file index theo app.set là 'ejs', 'views'
                {
                    user: user,
                    name: name,
                    workTimes: workTimes,
                    i: i,
                    pageTitle: 'Điểm danh', // Page Title
                    path: '/check/:staff_id' // Thuộc tính path truyền vào
                }
            );
        })
        .catch(err => {
            console.error('CHECK! ERROR:', err);
        })
    ;
};

exports.postBegin = (req, res, next) => {
    const staff_id = req.body.staff_id;
    const at = req.body.at;
    const dateWork = handle.handleTime.D_M_YPrint();
    const timeNow = handle.handleTime.H_MPrint(new Date());
    
    return WorkTime
        .find({ $and: [
            { 'staff_id': staff_id },
            { 'date': dateWork }
        ] })
        .then(workTimes => {
            i = workTimes.length - 1; // index phiên cuối
            // Thay đổi dữ liệu phiên cuối
            if (i === 0) {workTimes[0].workTime = '00:00'} // Nếu chỉ mới tạo phiên thì workTime = '00:00'
            else {workTimes[i].workTime = workTimes[i-1].workTime}; // Lấy giá trị workTime cũ
            workTimes[i].state = true;
            workTimes[i].begin = timeNow;
            workTimes[i].end = 'Chưa ghi nhận!',
            workTimes[i].at = at;
            workTimes[i].save();
            return workTimes; // Nếu đã có workTime ngày hôm nay return toàn bộ workTime
        })
        .then(result => {
            console.log('STARTED!');
            return res.redirect('/');
        })
        .catch(err => console.log(__dirname, err))
    ;
};

exports.postEnd = (req, res, next) => {
    const staff_id = req.body.staff_id;
    const dateWork = handle.handleTime.D_M_YPrint();
    const timeNow = handle.handleTime.H_MPrint(new Date());
    
    return WorkTime
        .find({ $and: [
            { 'staff_id': staff_id },
            { 'date': dateWork }
        ] })
        .then(workTimes => {
            i = workTimes.length - 1; // index phiên cuối
            if (i === 0) {workTimes[0].workTime = handle.handleTime.workTime(workTimes[0].begin, timeNow, '00:00/00:00')} // Nếu chỉ mới tạo phiên thì workTime = '00:00/00:00'
            else {workTimes[i].workTime = handle.handleTime.workTime(workTimes[i].begin, timeNow, workTimes[i-1].workTime)}; // Lấy giá trị workTime cũ
            workTimes[i].state = false;
            workTimes[i].end = timeNow;
            workTimes[i].__v ++;
            workTimes[i].save();
            return workTimes;
        })
        .then(result => {
            console.log('END!');
            return res.redirect('/check/' + staff_id);
        })
        .catch(err => console.log(__dirname, err))
    ;
};

exports.confirmWork = (req, res, next) => {
    const workTime_id = req.body.workTime_id;
    const staff_id = req.body.staff_id;
    
    return WorkTime
        .findOne({ '_id': workTime_id })
        .then(workTime => {
            workTime.confirm = true;
            workTime.save();
            return workTime;
        })
        .then(result => {
            console.log('CONFIRMED!');
            return res.redirect('/check/' + staff_id);
        })
        .catch(err => console.log(__dirname, err))
    ;
};

exports.getAL = (req, res, next) => {
    const _id = req.params._id;
    const user = req.session.user;
    const date = handle.handleTime.D_M_YPrint();
    const annuReg = req.body.aLHour;
    const LD = req.body.LD;

    AnnualLeave
        .findOne({ $and: [
            { 'staffId': _id },
            { 'date': ' ' }
        ] })
        .populate('staffId', 'name')
        .then(annu => {
            if (!annu) {
                const newAnnu = new AnnualLeave ({
                    staffId: _id,
                    confirm: false,
                    date: ' ',
                    register: 0,
                    reason: ' '
                });
                newAnnu.save();
                return newAnnu;
            };
            console.log(annu);
            return annu;
        })
        .then(annu => {
            return res.render(
                'MH-1_2', // Đến file index theo app.set là 'ejs', 'views'
                {
                    user: user,
                    work: annu,
                    pageTitle: 'Nghĩ phép', // Page Title
                    path: '/annualLeave/:staff_id' // Thuộc tính path truyền vào
                }
            );
        })
        .catch(err => {
            console.error(__dirname, "2", err);
        })
    ;
}

// exports.postAnLeRe = (req, res, next) => {
//     const _id = req.body._id;
//     const date = req.body.aLDate.toString();
//     const month = date.slice(0, 7);
//     const annu = req.body.aLHour;
//     const LD = req.body.LD;
//     const newReg = {
//         date: date,
//         reg: annu/8,
//         LD: LD
//     }

//     WorkTime
//         .findOne({ $and: [
//             { 'id': _id },
//             { 'month': month }
//         ] })
//         .then(work => {
//             if (!work) {
//                 const work = new Work({
//                     id: _id,
//                     month: month,
//                     annualLeave: {
//                         total: 10,
//                         anLeReg: []
//                     },
//                     working: []
//                 });
//                 work.addAnnualLeave(newReg);
//                 return work;
//             };
//             work.addAnnualLeave(newReg);
//             return work;
//         })
//         .then(result => {
//             console.log('Đăng ký nghĩ thành công!');
//             res.redirect('/');
//         })
//         .catch(err => console.log(__dirname, err))
//     ;
// }