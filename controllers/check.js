const Work = require('../models/work');
const handle = require('../models/handle');

exports.getIndex = (req, res, next) => {
    const _id = req.params._id;
    const name = req.staff.name;
    const dateWork = handle.handleTime.D_M_YPrint();

    Work
        .findById(_id)
        .then(work => {
            if (!work) {
                const work = new Work({
                    _id: _id,
                    annualLeave: {
                        total: 10,
                        anLeRe: []
                    },
                    working: [{
                        dateWork: dateWork,
                        state: false,
                        workTime: '00:00',
                        begin: 'Chưa ghi nhận!',
                        end: 'Chưa ghi nhận!',
                        at: 'Công ty'
                    }]
                });
                return work.save();
            };
            if (work.working[0].dateWork !== dateWork) {
                const newWorking = {
                    dateWork: dateWork,
                    state: false,
                    workTime: '00:00',
                    begin: 'Chưa ghi nhận!',
                    end: 'Chưa ghi nhận!',
                    at: 'Công ty'
                }
                work.editWorking(newWorking);
            };
            return work;
        })
        .then(work => {
            return res.render(
                'MH-1', // Đến file index theo app.set là 'ejs', 'views'
                {
                    _id: _id,
                    work: work,
                    name: name,
                    pageTitle: 'Điểm danh', // Page Title
                    path: '/check/:_id', // Để truy cập view trên trình duyệt
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
    const timeNow = handle.handleTime.H_MPrint(new Date());
    const at = req.body.at;
    
    Work
        .findById(_id)
        .then(work => {
            const newWorking = {
                dateWork: dateWork,
                state: true,
                workTime: work.working[0].workTime,
                begin: timeNow,
                end: 'Chưa ghi nhận!',
                at: at
            }
            work.editWorking(newWorking);
            return work;
        })
        .then(result => {
            console.log(result);
            res.redirect('/');
        })
        .catch(err => console.log(__dirname, err))
    ;
}

exports.postEnd = (req, res, next) => {
    const _id = req.body._id;
    const timeNow = handle.handleTime.H_MPrint(new Date());
    
    Work
        .findById(_id)
        .then(work => {
            const newWorking = {
                dateWork: work.working[0].dateWork,
                state: false,
                workTime: handle.handleTime.workTime(work.working[0].begin, timeNow, work.working[0].workTime),
                begin: work.working[0].begin,
                end: timeNow,
                at: work.working[0].at
            }
            work.editWorking(newWorking);
            return work;
        })
        .then(result => {
              console.log(result);
            res.redirect('/');
        })
        .catch(err => console.log(__dirname, err))
    ;
}

exports.postAnLeRe = (req, res, next) => {
    const _id = req.body._id;
    const date = req.body.aLDate.toString();
    const annu = req.body.aLHour;
    const LD = req.body.LD;

    Work
        .findById(_id)
        .then(work => {
            const newReg = {
                date: date,
                reg: annu/8,
                LD: LD,
            }
            work.addAnnualLeave(newReg);  
            return work;
        })
        .then(result => {
            console.log(result);
            res.redirect('/');
        })
        .catch(err => console.log(__dirname, err))
    ;
}