const Check = require('../models/work');
const Staff = require('../models/staff');

exports.getIndex = (req, res, next) => {
    const _id = req.params._id;
    Staff
        .findById(_id)
        .then(staff => {
            return res.render(
                'MH-3', // Đến file index theo app.set là 'ejs', 'views'
                {
                    // checks: checks,
                    staff: staff,
                    pageTitle: 'Chi tiết lương', // Page Title
                    path: '/salary', // Để truy cập view trên trình duyệt
                }
            );
        })
        .catch(err => {
            console.error(__dirname, "10", err);
        })
    ;
}