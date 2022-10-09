const Staff = require('../models/staff');

exports.getIndex = (req, res, next) => {
    const user = req.session.user;

    if (!user) {
        return res.redirect('/login');
    } else {
        let findStaff;
        
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
                        pageTitle: 'Nhân viên', // Page Title
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
    const updatedImageUrl = req.body.imageUrl;
    
    Staff
        .findById(_id)
        .then(staff => {
            staff.imageUrl = updatedImageUrl;
            return staff.save()
        })
        .then(() => {
            console.log('UPDATED STAFF!');
            res.redirect('/');
        })
        .catch(err => console.log(err))
    ;
};