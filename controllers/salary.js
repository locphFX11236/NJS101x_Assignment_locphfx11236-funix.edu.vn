const WorkData = require('../models/workData');
const WorkTime = require('../models/workTime');
const AnnualLeave = require('../models/annualLeave');
const handle = require('../util/handle');
const staff = require('../models/staff');

exports.getIndex = async (req, res, next) => {
    const staff_id = req.params.staff_id;
    const date = new Date();
    const isQuery = req.query.month ? true : false;
    const defaultShowPage = +req.query.page || 1;
    const ITEMS_PER_PAGE = +req.query.item || 2;
    const monthSalary = isQuery ? req.query.month : `${date.getFullYear()}-${date.getMonth() + 1}`;
    let totalItems;
    let reqStaff;

    if (!req.session.user) return res.redirect('/login');

    // Nạp thông tin staff
    if (req.session.user.isManager) {
        staff
            .findOne({ '_id': staff_id })
            .then(staff => {
                req.staff = staff;
                reqStaff = staff;
            })
        ;
    } else reqStaff = req.staff;

    // Xử lý và lưu data
    Promise
        .all([
            WorkTime.find({ 'staff_id': staff_id }),
            AnnualLeave.findOne({ 'staff_id': staff_id })
        ])
        .then(data => handle.handleSalary.getData(staff_id, data))
        .then(async data => {
            return WorkData
                .find({ 'staff_id': staff_id })
                .then(dataStaff => {
                    data.forEach((d, i) => {
                        if (!dataStaff[i]) { // Thêm phần tử chênh lệch thứ i, nếu dataStaff[i] === undefined
                            const newDataStaff = new WorkData(d);
                            newDataStaff.save();
                            dataStaff.push(newDataStaff);
                        } else dataStaff;
                    });
                    return dataStaff;
                })
                // .then(() => console.log('UPDATE TO "WorkData"'))
                .catch(err => console.log('NOT UPDATE TO "WorkData"! ERROR: ', err));
            ;
        })
    ;

    // Render
    return Promise
        .all([
            WorkData.find({ 'staff_id': staff_id }), // Dữ liệu tính toán
            WorkData
                .find({ 'staff_id': staff_id })
                .countDocuments()
                .then(numWorkData => {
                  totalItems = numWorkData;
                  return WorkData
                    .find()
                    .skip((defaultShowPage - 1) * ITEMS_PER_PAGE)
                    .limit(ITEMS_PER_PAGE)
                })
            , // Render view
        ])
        .then(data => {
            const dateArray1 = Array.from( new Set( data[0].map(d => d.date) ) );
            const dateArray2 = dateArray1.filter(d => d.includes(monthSalary));
            const dateArray = isQuery ? dateArray2 : dateArray1;
            const sessionData = handle.handleSalary.getSessionData(dateArray, data[1]); // Render
            const dateData = handle.handleSalary.getDateData(dateArray, data[0]);
            const monthData = handle.handleSalary.getMonthData(monthSalary, dateData);
            // console.log({dateData: dateData, sessionData: sessionData, monthData: monthData});
            return {dateData: dateData, sessionData: sessionData, monthData: monthData};
        })
        .then(data => {
            return res.render(
                'MH-3', // Đến file index theo app.set là 'ejs', 'views'
                {
                    sessionData: data.sessionData,
                    dateData: data.dateData,
                    monthData: data.monthData,
                    Staff: reqStaff,
                    isQuery: isQuery,
                    pageTitle: 'Thông tin làm', // Page Title
                    path: '/salary/:staff_id', // Thuộc tính path truyền vào
                    currentPage: defaultShowPage,
                    hasNextPage: ITEMS_PER_PAGE * defaultShowPage < totalItems,
                    hasPrevPage: defaultShowPage > 1,
                    nextPage: defaultShowPage + 1,
                    prevPage: defaultShowPage - 1,
                    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                    oldState: {
                        showPage: defaultShowPage,
                        item: ITEMS_PER_PAGE,
                        month: monthSalary
                    },
                }
            );
        })
    ;
}

exports.searchSalary = async (req, res, next) => {
    const staff_id = req.body.staff_id;
    const month = req.body.monthSearch;
    const page = req.query.page;
    const item = req.query.item;

    return res.redirect(`/salary/${staff_id}?page=${page}&item=${item}&month=${month}`);
};

exports.itemPage = async (req, res, next) => {
    const item = req.body.item;
    const staff_id = req.body.staff_id;
    const month = req.query.month;

    return res.redirect(`/salary/${staff_id}?item=${item}&month=${month}`);
};

// // exports.seachMonth = (req, res, next) => {
// //     const _id = req.body._id;
// //     const name = req.staffName;
// //     const HSL = req.staffHSL;
// //     let seachMonth;
// //     if (req.body.seachMonth) {
// //         seachMonth = req.body.seachMonth.toString().slice(0, 7);
// //     } else {
// //         seachMonth = handle.handleTime.D_M_YPrint().slice(0, 7);
// //     }

// //     Work
// //         .findOne({ $and: [
// //             { 'id': _id },
// //             { 'month': seachMonth }
// //         ] })
// //         .then(work => {
// //             let OT, LT;
// //             const WT = handle.handleSalary.workTime(work.working[0].workTime);
// //             if (WT >= 160) {
// //                 OT = WT - 160;
// //                 LT = 0;
// //             } else {
// //                 LT = 160 - WT;
// //                 OT = 0;
// //             }
// //             const L = HSL*3000000 + (OT - LT)*200000;
// //             let seachData = {
// //                 Luong: L,
// //                 HSL: HSL,
// //                 OT: OT,
// //                 LT: LT
// //             }
// //             return seachData;
// //         })
// //         .then(result => {
// //             return res.render(
// //                 'MH-3', // Đến file index theo app.set là 'ejs', 'views'
// //                 {
// //                     _id: _id,
// //                     seachData: result,
// //                     name: name,
// //                     pageTitle: 'Điểm danh', // Page Title
// //                     path: '/seachData'
// //                 }
// //             );
// //         })
// //         .catch(err => {
// //             console.error(__dirname, err);
// //         })
// //     ;
// // }