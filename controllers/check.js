const Work = require('../models/work');
const handle = require('../models/handle');

exports.getIndex = (req, res, next) => {
    const _id = req.params._id;
    const name = req.staffName;
    const dateWork = handle.handleTime.D_M_YPrint();
    const month = dateWork.slice(0, 7);

    Work
        .findOne({ $and: [
            { 'id': _id },
            { 'month': month }
        ] })
        .then(work => {
            const newWorking = {
                date: dateWork,
                state: false,
                workTime: '00:00' + '/' + '00:00',
                begin: 'Chưa ghi nhận!',
                end: 'Chưa ghi nhận!',
                at: 'Công ty'
            }
            if (!work) {
                const work = new Work({
                    id: _id,
                    month: month,
                    annualLeave: {
                        total: 10,
                        anLeReg: []
                    },
                    working: []
                });
                work.working.unshift(newWorking)
                work.save();
                return work;
            };
            if (work.working.length === 0) {
                work.working.unshift(newWorking);
                work.save();
                return work;
            }
            return work;
        })
        .then(work => {
            return res.render(
                'MH-1', // Đến file index theo app.set là 'ejs', 'views'
                {
                    _id: _id,
                    date: dateWork,
                    work: work,
                    name: name,
                    pageTitle: 'Điểm danh', // Page Title
                    path: '/check' // Thuộc tính path truyền vào
                }
            );
        })
        .catch(err => {
            console.error(__dirname, "10", err);
        })
    ;
}

exports.postBegin = (req, res, next) => {
    const _id = req.body._id;
    const dateWork = handle.handleTime.D_M_YPrint();
    const month = dateWork.slice(0, 7);
    const timeNow = handle.handleTime.H_MPrint(new Date());
    const at = req.body.at;
    
    Work
        .findOne({ $and: [
            { 'id': _id },
            { 'month': month }
        ] })
        .then(work => {
            const newWorking = {
                date: dateWork,
                state: true,
                workTime: work.working[0].workTime,
                begin: timeNow,
                end: 'Chưa ghi nhận!',
                at: at
            }
            work.editWork(newWorking, dateWork);
            return work;
        })
        .then(result => {
            console.log('Bắt đầu phiên làm việc');
            res.redirect('/');
        })
        .catch(err => console.log(__dirname, err))
    ;
}

exports.postEnd = (req, res, next) => {
    const _id = req.body._id;
    const dateWork = handle.handleTime.D_M_YPrint();
    const month = dateWork.slice(0, 7);
    const timeNow = handle.handleTime.H_MPrint(new Date());
    
    Work
        .findOne({ $and: [
            { 'id': _id },
            { 'month': month }
        ] })
        .then(work => {
            const newWorking = {
                date: dateWork,
                state: false,
                workTime: handle.handleTime.workTime(work.working[0].begin, timeNow, work.working[0].workTime),
                begin: work.working[0].begin,
                end: timeNow,
                at: work.working[0].at
            }
            work.editWork(newWorking, dateWork);
            return work;
        })
        .then(result => {
            console.log('Kết thúc phiên làm việc');
            res.redirect('/');
        })
        .catch(err => console.log(__dirname, err))
    ;
}

exports.postAnLeRe = (req, res, next) => {
    const _id = req.body._id;
    const date = req.body.aLDate.toString();
    const month = date.slice(0, 7);
    const annu = req.body.aLHour;
    const LD = req.body.LD;
    const newReg = {
        date: date,
        reg: annu/8,
        LD: LD
    }

    Work
        .findOne({ $and: [
            { 'id': _id },
            { 'month': month }
        ] })
        .then(work => {
            if (!work) {
                const work = new Work({
                    id: _id,
                    month: month,
                    annualLeave: {
                        total: 10,
                        anLeReg: []
                    },
                    working: []
                });
                work.addAnnualLeave(newReg);
                return work;
            };
            work.addAnnualLeave(newReg);
            return work;
        })
        .then(result => {
            console.log('Đăng ký nghĩ thành công!');
            res.redirect('/');
        })
        .catch(err => console.log(__dirname, err))
    ;
}