const Covid = require('../models/covid');
const Staff = require('../models/staff');

exports.getIndex = (req, res, next) => {
    const _id = req.params._id;
    Staff
        .findById(_id)
        .then(staff => {
            return res.render(
                'MH-4', // Đến file MH-4 theo app.set là 'ejs', 'views'
                {
                    staff: staff,
                    pageTitle: 'Thông tin covid-19', // Page Title
                    path: '/covid', // Để truy cập view trên trình duyệt
                }
            );
        })
        .catch(err => {
            console.error(__dirname, "10", err);
        })
    ;
}

// exports.postVaccine = (req, res, next) => {
//     const staffId = req.body.staffId;
//     const ngayTiem = req.body.ngayTiem;
//     const loaiVaccine = req.body.loaiVaccine;
//     Covid.vaccine(staffId, loaiVaccine, ngayTiem);
//     return res.redirect('/');
// }

// exports.postXN = (req, res, next) => {
//     const staffId = req.body.staffId;
//     const ngay = new Date().toISOString();
//     Covid.xetNghiem(staffId, ngay);
//     return res.redirect('/');
// }

// exports.postND = (req, res, next) => {
//     const staffId = req.body.staffId;
//     const nhietDo = req.body.nhietDo;
//     const ngay = new Date().toISOString();
//     Covid.nhietDo(staffId, nhietDo, ngay);
//     return res.redirect('/');
// }