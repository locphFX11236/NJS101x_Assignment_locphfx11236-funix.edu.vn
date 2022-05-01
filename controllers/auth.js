const bcrypt = require('bcryptjs'); // Package hash mật khẩu để bảo mật

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    
    // Xử lý error message
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    return res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message // Gọi giá trị của error trong đối tượng req.flash
    });
};

exports.postLogin = (req, res, next) => {
    const userId = req.body.userId;
    const password = req.body.password; // password là 123

    User
        .findOne({userId: userId})
        .then(user => {
            if (!user) {
                req.flash('error', 'ID Not Found!'); // Thêm vào req.flash 1 đối tượng {'error', 'ID Not Found!'}
                return res.redirect('/login');
            }
            bcrypt
                .compare(password, user.password) // So sánh mật khẩu đã hash
                .then(doMatch => {
                    if (doMatch) {
                        const session = req.session; // Vào database tạo 1 session
                        // Add các giá trị vào session
                        session.isLoggedIn = true;
                        session.user = user;
                        return req.session.save(err => {
                            console.log(__dirname, '3', err);
                            return res.redirect('/');
                        }); // Lưu session vào database
                    }
                    res.redirect('/404');
                })
                .catch(err => {
                  console.log(err);
                  res.redirect('/404');
                })
            ;
        })
        .catch(err => {
            console.log(err);
        })
    ;
};

exports.postLogout = (req, res, next) => {
    const session = req.session; // Vào database tạo 1 session
    return session.destroy((err) => {
        console.log(__dirname, '2', err);
        res.redirect('/');
    }); // Xóa session trong database
}; 