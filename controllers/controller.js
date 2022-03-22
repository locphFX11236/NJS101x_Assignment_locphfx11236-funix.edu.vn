const Thongtin = require('../models/thongtin');

exports.getIndex = (req, res, next) => {
    Thongtin.fetchAll(staffs => {
        res.render(
            'index', // Đến file index theo app.set là 'ejs', 'views'
            {
                staffs: staffs,
                pageTitle: 'Danh sách nhân viên', // Page Title
                path: '/', // Để truy cập view trên trình duyệt
            }
        );
    });
};

exports.getStaffWithId = (req, res, next) => {
    const staffId = req.params.staffId;
    Thongtin.findById(staffId, staff => {
        res.render(
            'MH-2', // Đến file MH-2 theo app.set là 'ejs', 'views'
            {
                staff: staff,
                pageTitle: 'Thông tin nhân viên', // Page Title
                path: '/staff/:staffId', // Để truy cập view trên trình duyệt
            }
        );
    });
};

exports.postEditStaff = (req, res, next) => {
    const staffId = req.body.staffId;
    const updatedImageUrl = req.body.imageUrl;
    Thongtin.editImg(staffId, updatedImageUrl);
    return res.redirect('/');
};