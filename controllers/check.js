const Check = require('../models/check');
const Staff = require('../models/staff');

exports.getIndex = (req, res, next) => {
    const _id = req.params._id;
    Staff
        .findById(_id)
        .then(staff => {
            return res.render(
                'MH-1', // Đến file index theo app.set là 'ejs', 'views'
            {
                // checks: checks,
                staff: staff,
                pageTitle: 'Điểm danh', // Page Title
                path: '/check', // Để truy cập view trên trình duyệt
            }
            );
        })
        .catch(err => {
            console.error(__dirname, "10", err);
        })
    ;
}