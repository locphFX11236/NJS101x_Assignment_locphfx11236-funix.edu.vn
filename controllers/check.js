const WorkTime = require('../models/workTime');
const AnnualLeave = require('../models/annualLeave');
const handle = require('../util/handle');
const Staff = require('../models/staff');

let i;

exports.getIndex = async (req, res, next) => {
    const staff_id = req.params.staff_id;
    const user = req.session.user;
    const dateWork = handle.handleTime.D_M_YPrint();

    if (!user) return res.redirect('/login');

    // Làm sạch data
    WorkTime
        .find({ 'staff_id': staff_id })
        .then(workTimes => {
            i = workTimes.length - 1; // index phiên cuối
            // Kiểm tra phiên ngày cuối
            if (workTimes[i].date !== dateWork) {
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
            console.error('NOT DATABASE! ERROR:', err);
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
                    'totalWorkTime': '00:00',
                    'begin': 'Chưa ghi nhận!',
                    'end': 'Chưa ghi nhận!',
                    'at': 'Công ty',
                    '__v': 0
                });
                newWorkTime.save();
                workTimes.push(newWorkTime);
                console.log('CREATING DATABASE!');
                return workTimes;
            } else if (workTimes[i].__v === 1) { // Nếu đã kết thúc phiên trước thì tạo phiên mới
                let totalWorkTime = workTimes[i].workTime;
                if (i !== 0) { totalWorkTime = workTimes[i-1].totalWorkTime}; // Nếu là phiên đầu tiên thì lấy totalWorkTime = '00:00'
                const newWorkTime = new WorkTime ({
                    'staff_id': staff_id,
                    'confirm': false,
                    'date': dateWork,
                    'state': false,
                    'workTime': workTimes[i].workTime,
                    'totalWorkTime':  totalWorkTime,
                    'begin': 'Chưa ghi nhận!',
                    'end': 'Chưa ghi nhận!',
                    'at': 'Công ty',
                    '__v': 0
                });
                newWorkTime.save();
                workTimes.push(newWorkTime);
                return workTimes;
            };
            return workTimes;
        })
        .then(workTimes => {
            i = workTimes.length - 1;
            const name = workTimes[i].staff_id.name; // Lỗi không đồng bộ in ra name ***********
            return res.render(
                'MH-1_1', // Đến file index theo app.set là 'ejs', 'views'
                {
                    user: user,
                    name: name,
                    i: i,
                    workTimes: workTimes,
                    pageTitle: 'Điểm danh', // Page Title
                    path: '/check/:staff_id' // Thuộc tính path truyền vào
                } // Object chứa thuộc tính truyền vào file được gọi ở trên
            );
        })
        .catch(err => {
            console.error('CHECK! ERROR:', err);
        })
    ;
};

exports.postBegin = async (req, res, next) => {
    const staff_id = req.body.staff_id;
    const at = req.body.at;
    const dateWork = handle.handleTime.D_M_YPrint();
    const timeNow = handle.handleTime.H_MPrint(new Date());
    
    return WorkTime
        .find({ $and: [ // Tìm theo ngày và staff_id
            { 'staff_id': staff_id },
            { 'date': dateWork }
        ] })
        .then(workTimes => {
            i = workTimes.length - 1; // index phiên cuối
            
            if (i > 0) {workTimes[i].workTime = workTimes[i-1].workTime}; // Nếu không là phiên đầu lấy giá trị workTime cũ
            
            workTimes[i].state = true;
            workTimes[i].begin = timeNow;
            workTimes[i].at = at;

            workTimes[i].save();
            return workTimes; // Nếu đã có workTime ngày hôm nay return toàn bộ workTime
        })
        .then(() => {
            console.log('STARTED!');
            return res.redirect('/');
        })
        .catch(err => console.log(__dirname, err))
    ;
};

exports.postEnd = async (req, res, next) => {
    const staff_id = req.body.staff_id;
    const dateWork = handle.handleTime.D_M_YPrint();
    const timeNow = handle.handleTime.H_MPrint(new Date());
    
    return WorkTime
        .find({ $and: [
            { 'staff_id': staff_id },
            { 'date': dateWork }
        ] })
        .then(workTimes => {
            const countTime = (a, b, c) => handle.handleTime.workTime(a, b, c);
            i = workTimes.length - 1; // index phiên cuối

            workTimes[i].state = false;
            workTimes[i].end = timeNow;
            workTimes[i].__v ++;

            if (i === 0) { // Phiên đầu tiên trong ngày lấy giá trị workTime cũ của chính nó
                const resultTime = countTime(workTimes[0].begin, timeNow, workTimes[0].workTime);
                workTimes[i].workTime = resultTime[0];
                workTimes[i].totalWorkTime = resultTime[1];
            } else { // Phiên không phải đầu tiên lấy giá trị workTime của phiên trước đó
                const resultTime = countTime(workTimes[i].begin, timeNow, workTimes[i-1].workTime);
                workTimes[i].workTime = resultTime[0];
                workTimes[i].totalWorkTime = resultTime[1];
            };

            workTimes[i].save();
            // console.log(workTimes[i])
            return workTimes;
        })
        .then(() => {
            console.log('END!');
            return res.redirect('/check/' + staff_id);
        })
        .catch(err => console.log(__dirname, err))
    ;
};

exports.confirmWork = async (req, res, next) => {
    const workTime_id = req.body.workTime_id;
    const dateWork = handle.handleTime.D_M_YPrint();
    const staff_id = req.body.staff_id;
    
    return WorkTime
        .findOne({ $and: [
            { '_id': workTime_id },
            { 'date': dateWork }
        ] })
        .then(workTime => {
            workTime.confirm = true;
            workTime.save();
            return workTime;
        })
        .then(() => {
            console.log('CONFIRMED TO WORK TIME!');
            return res.redirect('/check/' + staff_id);
        })
        .catch(err => console.log('NOT CONFIRMED! ERROR: ', err))
    ;
};

exports.deleteWork = async (req, res, next) => {
    const workTime_id = req.body.workTime_id;
    const staff_id = req.body.staff_id;
    
    return WorkTime
        .deleteOne({ '_id': workTime_id })
        .then(() => {
            console.log('CONFIRMED TO WORK TIME!');
            return res.redirect('/check/' + staff_id);
        })
        .catch(err => console.log('NOT CONFIRMED! ERROR: ', err))
    ;
};

exports.getAL = async (req, res, next) => {
    const staff_id = req.params.staff_id;
    const user = req.session.user;
    let reqStaff;

    if (!user) return res.redirect('/login');

    if (req.session.user.isManager) {
        Staff
            .findOne({ '_id': staff_id })
            .then(staff => {
                req.staff = staff
                reqStaff = staff
            })
        ;
    } else reqStaff = req.staff;

    return AnnualLeave
        .findOne({ 'staff_id': staff_id }) // Tìm thông tin bằng staff_id
        .then(annu => { // Nếu hôm nay chưa có đăng kí
            if (!annu) {
                const newAnnu = new AnnualLeave({
                    staff_id: staff_id,
                    annualLeave: 10,
                    regInformation: []
                });
                return newAnnu;
            } else return annu;
        })
        .then(annus => {
            return res.render(
                'MH-1_2', // Đến file index theo app.set là 'ejs', 'views'
                {
                    Annus: annus,
                    User: user,
                    Staff: reqStaff,
                    pageTitle: 'Nghĩ phép', // Page Title
                    path: '/annualLeave/:staff_id' // Thuộc tính path truyền vào
                }
            );
        })
        .catch(err => {
            console.error('GET ANNUAL LEAVE! ERROR: ', err);
        })
    ;
}

exports.postAnLeRe = async (req, res, next) => {
    const dateReg = handle.handleTime.D_M_YPrint();
    const staff_id = req.body.staff_id;
    const leaveDate = req.body.leaveDate.toString();
    const leaveHour = req.body.leaveHour;
    const reason = req.body.reason;
    const newAnnualLeave = {
        confirm: false,
        leaveDate: leaveDate,
        register: leaveHour/8,
        reason: reason
    };

    return AnnualLeave
        .findOne({ 'staff_id': staff_id }) // Tìm thông tin bằng staff_id
        .then(annu => annu.addToAnnu(newAnnualLeave))
        .then(() => {
            console.log('Đăng ký nghĩ thành công!');
            return res.redirect('/');
        })
        .catch(err => console.log('Đăng ký nghĩ không thành công! Error:', err))
    ;
}

exports.confirmAnnu = async (req, res, next) => {
    const annu_id = req.body.annualLeave_id;
    const staff_id = req.body.staff_id;

    return AnnualLeave
        .findOne({ 'staff_id': staff_id })
        .then(annu => { // Xác nhận
            const confIndex = annu.regInformation.findIndex((a) => a._id == annu_id);
            annu.regInformation[confIndex].confirm = true; // Sửa confirm thành true
            annu.annualLeave -= annu.regInformation[confIndex].register; // Tính annualLeave
            annu.save(); // Lưu vào AnnualLeave
            return annu;
        })
        .then(async annu => { // Đẩy annualLeave lên Staff
            return Staff
                .findById(staff_id)
                .then((staff) => {
                    staff.annualLeave = annu.annualLeave;
                    staff.save();
                })
                .then(() => console.log('UPDATE TO STAFF DATABASE!'))
                .catch(err => console.log('NOT UPDATE TO STAFF! ERROR: ', err));
            ;
        })
        .then(() => { // Thông báo
            console.log('CONFIRMED TO LEAVE!');
            return res.redirect('back');
        })
        .catch(err => console.log('NOT CONFIRMED! ERROR: ', err)); // Thông báo lỗi
    ;
};