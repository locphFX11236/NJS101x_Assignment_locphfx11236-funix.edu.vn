const WorkData = require('../models/workData');

exports.getIndex = async (req, res, next) => {
    const staff_id = req.params.staff_id;
    const reqStaff = req.staff;
    const search = req.session.searchValue;
    let sortObject;

    console.log(search.length);
    if (search.length === 0) { sortObject = { 'date': -1 }; }
    else {
        sortObject = search[0];
    };

    return WorkData
        .find({ 'staff_id': staff_id })
        .sort(sortObject)
        .then(workDatas => {
            return res.render(
                'MH-3', // Đến file index theo app.set là 'ejs', 'views'
                {
                    workDatas: workDatas,
                    Staff: reqStaff,
                    pageTitle: 'Thông tin làm', // Page Title
                    path: '/salary/:staff_id' // Thuộc tính path truyền vào
                }
            );
        })
    ;
}

exports.sortList = async (req, res, next) => {
    const staff_id = req.body.staff_id;
    const sortField = req.body.sortField;
    const sortValue = req.body.sortValue;
    let sortObject;

    console.log(req.body)
    if (sortField === 'date') {
        sortObject = { 'date': sortValue };
    } else {
        sortObject = { 'totalWorkTime': sortValue };
    };
    // req.searchValue.push(sortObject);
    console.log(req.searchValue)

    return res.redirect('/salary/' + staff_id);
}

// exports.seachMonth = (req, res, next) => {
//     const _id = req.body._id;
//     const name = req.staffName;
//     const HSL = req.staffHSL;
//     let seachMonth;
//     if (req.body.seachMonth) {
//         seachMonth = req.body.seachMonth.toString().slice(0, 7);
//     } else {
//         seachMonth = handle.handleTime.D_M_YPrint().slice(0, 7);
//     }

//     Work
//         .findOne({ $and: [
//             { 'id': _id },
//             { 'month': seachMonth }
//         ] })
//         .then(work => {
//             let OT, LT;
//             const WT = handle.handleSalary.workTime(work.working[0].workTime);
//             if (WT >= 160) {
//                 OT = WT - 160;
//                 LT = 0;
//             } else {
//                 LT = 160 - WT;
//                 OT = 0;
//             }
//             const L = HSL*3000000 + (OT - LT)*200000;
//             let seachData = {
//                 Luong: L,
//                 HSL: HSL,
//                 OT: OT,
//                 LT: LT
//             }
//             return seachData;
//         })
//         .then(result => {
//             return res.render(
//                 'MH-3', // Đến file index theo app.set là 'ejs', 'views'
//                 {
//                     _id: _id,
//                     seachData: result,
//                     name: name,
//                     pageTitle: 'Điểm danh', // Page Title
//                     path: '/seachData'
//                 }
//             );
//         })
//         .catch(err => {
//             console.error(__dirname, err);
//         })
//     ;
// }