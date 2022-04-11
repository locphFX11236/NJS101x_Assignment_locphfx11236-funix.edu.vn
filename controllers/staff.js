const Staff = require('../models/staff');

exports.getIndex = (req, res, next) => {
    Staff
        .find()
        .then(staffs => {
            res.render(
                'index', // Đến file index theo app.set là 'ejs', 'views'
                {
                    staffs: staffs,
                    pageTitle: 'Danh sách nhân viên', // Page Title
                    path: '/', // Để truy cập view trên trình duyệt
                }
            );
        })
        .catch(err => {
            console.error(err);
        })
    ;
};

exports.getStaffWithId = (req, res, next) => {
    const _id = req.params._id;
    Staff
        .findById(_id)
        .then(staff => {
            return res.render(
                'MH-2', // Đến file MH-2 theo app.set là 'ejs', 'views'
                {
                    staff: staff,
                    pageTitle: 'Thông tin nhân viên', // Page Title
                    path: '/staff', // Để truy cập view trên trình duyệt
                }
            );
        })
        .catch(err => {
            console.error(err);
        })
    ;
};

exports.postEditStaff = (req, res, next) => {
    const _id = req.body._id;
    const updatedImageUrl = req.body.imageUrl;
    const name = req.body.name;
    const doB = req.body.doB;
    const salaryScale = req.body.salaryScale;
    const startDate = req.body.startDate;
    const department = req.body.department;
    const annualLeave = req.body.annualLeave;
    
    Staff
        .findById(_id)
        .then(staff => {
            staff.imageUrl = updatedImageUrl;
            staff.name = name;
            staff.doB = doB;
            staff.salaryScale = salaryScale;
            staff.startDate = startDate;
            staff.department = department;
            staff.annualLeave = annualLeave;
            return staff.save()
        })
        .then(result => {
            console.log('UPDATED STAFF!');
            res.redirect('/');
        })
        .catch(err => console.log(err))
    ;
};