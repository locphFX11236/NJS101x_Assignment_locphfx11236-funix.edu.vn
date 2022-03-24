const DiemDanh = require('../models/diemdanh');

exports.getIndex = (req, res, next) => {
    DiemDanh.fetchAll(checks => {
        res.render(
            'MH-1', // Đến file index theo app.set là 'ejs', 'views'
            {
                checks: checks,
                // staffs: staffs,
                pageTitle: 'Điểm danh', // Page Title
                path: '/diemdanh', // Để truy cập view trên trình duyệt
            }
        );
    });
        
};