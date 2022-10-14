const { validationResult } = require('express-validator');

const Staff = require('../models/staff');
const fileHelper = require('../util/deleteFile');

exports.getIndex = (req, res, next) => {
    const user = req.session.user;
    let findStaff;
    
    if (!user) return res.redirect('/login');
    if (user.isManager) {
        findStaff = { "managerId": user.staffId };
    } else {
        findStaff = { "user_id": user._id };
    };

    return Staff
        .find(findStaff)
        .then(staffs => {
            res.render(
                'index', // Đến file index theo app.set là 'ejs', 'views'
                {
                    user: user,
                    staffs: staffs,
                    pageTitle: user.isManager ? 'Nhân viên' : 'Home', // Page Title
                    path: '/' // Để truy cập view trên trình duyệt
                }
            );
        })
        .then(() => {
            console.log('STAFF!');
        })
        .catch(err => {
            console.error(err);
        })
    ;
};

exports.getStaffWithId = async (req, res, next) => {
    const _id = req.params._id;
    const user = req.session.user;

    return Staff
        .findById(_id)
        .populate('user_id', 'staffId')
        .then(staff => {
            return res.render(
                'MH-2', // Đến file MH-2 theo app.set là 'ejs', 'views'
                {
                    user: user,
                    staff: staff,
                    pageTitle: 'Thông tin nhân viên', // Page Title
                    path: '/staff/:_id' // Để truy cập view trên trình duyệt
                }
            );
        })
        .then(result => {
            console.log('STAFF INFORMATION!');
        })
        .catch(err => {
            console.error(err);
        })
    ;
};

exports.postEditStaff = (req, res, next) => {
    const _id = req.body._id;
    const image = req.file;
    // const updatedImageUrl = req.body.imageUrl;
    const updatedImageUrl = image.path;
    const errors = validationResult(req);

    Staff
        .findById(_id)
        .then(staff => {
            if (!errors.isEmpty()) {
                console.log(errors.array());
                return res.status(422).render('/MH-2', {
                    pageTitle: 'Edit Image',
                    path: '/staff/:_id',
                    editing: true,
                    hasError: true,
                    staffImg: { ...staff, imageUrl: updatedImageUrl },
                    errorMessage: errors.array()[0].msg,
                    validationErrors: errors.array()
                });
            };
        
            if (image) { // Nếu img ko lỗi
                fileHelper.deleteFile(staff.imageUrl); // Xóa ảnh cũ
                staff.imageUrl = updatedImageUrl; // Tạo kết nối với ảnh tải lên
                return staff.save()
            } else {
                return res.status(422).render('/MH-2', {
                    pageTitle: 'Edit Image',
                    path: '/staff/:_id',
                    editing: false,
                    hasError: true,
                    staffImg: { ...staff, imageUrl: updatedImageUrl },
                    errorMessage: 'Attached file is not an image.',
                    validationErrors: []
                });
            }
        })
        .then(() => {
            console.log('UPDATED STAFF!');
            res.redirect(`/staff/${_id}`);
        })
        .catch(err => console.log(err))
    ;
};