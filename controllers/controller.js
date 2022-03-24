const Thongtin = require('../models/thongtin');

exports.getIndex = (req, res, next) => {
    Thongtin
        .fetchAll()
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
            console.error(__dirname, "8", err);
        })
    ;
};

exports.getStaffWithId = (req, res, next) => {
    const staffId = req.params.staffId;
    Thongtin
        .findById(staffId)
        .then(staff => {
            return res.render(
                'MH-2', // Đến file MH-2 theo app.set là 'ejs', 'views'
                {
                    staff: staff,
                    pageTitle: 'Thông tin nhân viên', // Page Title
                    path: '/staff/:staffId', // Để truy cập view trên trình duyệt
                }
            );
        })
        .catch(err => {
            console.error(__dirname, "9", err);
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
    const staff = new Thongtin (
        _id,
        updatedImageUrl,
        name,
        doB,
        salaryScale,
        startDate,
        department,
        annualLeave,
    )

    return staff
        .save()
        .then(result => {
            console.log('UPDATED STAFF!');
            res.redirect('/');
        })
        .catch(err => console.log(err))
    ;
};