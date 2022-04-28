const bcrypt = require('bcryptjs'); // Package hash mật khẩu để bảo mật

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login'
    });
};

exports.postLogin = (req, res, next) => {
    const userId = req.body.userId;
    const password = req.body.password; // password là 123

    User
        .findOne({userId: userId})
        .then(user => {
            if (!user) {
                return res.redirect('/404');
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