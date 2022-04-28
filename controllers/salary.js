const Work = require('../models/work');
const handle = require('../models/handle');

exports.getIndex = (req, res, next) => {
    const _id = req.params._id;
    const name = req.staffName;
    let seachData;

    Work
        .find({ 'id': _id })
        .then(work => {
            return res.render(
                'MH-3', // Đến file index theo app.set là 'ejs', 'views'
                {
                    _id: _id,
                    seachData: seachData,
                    work: work,
                    name: name,
                    pageTitle: 'Điểm danh', // Page Title
                    path: '/salary' // Để truy cập view trên trình duyệt
                }
            );
        })
        .catch(err => {
            console.error(__dirname, err);
        })
    ;
}

exports.seachMonth = (req, res, next) => {
    const _id = req.body._id;
    const name = req.staffName;
    const HSL = req.staffHSL;
    let seachMonth;
    if (req.body.seachMonth) {
        seachMonth = req.body.seachMonth.toString().slice(0, 7);
    } else {
        seachMonth = handle.handleTime.D_M_YPrint().slice(0, 7);
    }

    Work
        .findOne({ $and: [
            { 'id': _id },
            { 'month': seachMonth }
        ] })
        .then(work => {
            let OT, LT;
            const WT = handle.handleSalary.workTime(work.working[0].workTime);
            if (WT >= 160) {
                OT = WT - 160;
                LT = 0;
            } else {
                LT = 160 - WT;
                OT = 0;
            }
            const L = HSL*3000000 + (OT - LT)*200000;
            let seachData = {
                Luong: L,
                HSL: HSL,
                OT: OT,
                LT: LT
            }
            return seachData;
        })
        .then(result => {
            return res.render(
                'MH-3', // Đến file index theo app.set là 'ejs', 'views'
                {
                    _id: _id,
                    seachData: result,
                    name: name,
                    pageTitle: 'Điểm danh', // Page Title
                    path: '/seachData'
                }
            );
        })
        .catch(err => {
            console.error(__dirname, err);
        })
    ;
}