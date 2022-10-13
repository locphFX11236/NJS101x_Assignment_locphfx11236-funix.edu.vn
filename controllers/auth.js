const bcrypt = require('bcryptjs'); // Package hash mật khẩu để bảo mật
const { validationResult } = require('express-validator'); // Package

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
        errorMessage: message, // Gọi giá trị của error trong đối tượng req.flash
        oldInput: {
            'userId': '',
            'password': ''
        },
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const staffId = req.body.staffId;
    const password = req.body.password; // password là 123
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                'staffId': staffId,
                'password': password
            },
            validationErrors: errors.array()
        });
    }  

    User
        .findOne({ "staffId": staffId })
        .then(user => {
            if (!user) {
                return res.status(422).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: 'Invalid ID.',
                    oldInput: {
                        'staffId': staffId,
                        'password': password
                    },
                    validationErrors: [{ param: 'staffId' }]
                });
            }
            bcrypt
                .compare(password, user.password) // So sánh mật khẩu đã hash
                .then(doMatch => {
                    if (doMatch) {
                        const session = req.session; // Vào database gọi session
                        // Add các giá trị vào session
                        session.isLoggedIn = true;
                        session.user = user;
                        return session.save(err => {
                            console.log('PASSWORD MATCHED! ERROR:', err);
                            return res.redirect('/');
                        }); // Lưu session vào database
                    }
                    return res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Invalid password.', // Pass không đúng
                        oldInput: {
                            'staffId': staffId,
                            'password': password
                        },
                        validationErrors: [{ param: 'password' }]
                    });
                })
                .then(result => {
                    console.log(staffId, 'LOG IN!');
                })
                .catch(err => {
                  console.log(err);
                  res.redirect('/404');
                })
            ;
        })
        .then(result => {
            console.log(staffId, 'USER FOUND!');
        })
        .catch(err => {
            console.log(err);
        })
    ;
};

exports.postLogout = (req, res, next) => {
    const session = req.session; // Vào database gọi session
    return session.destroy((err) => {
        console.log(session.user.staffId, 'LOG OUT! ERROR:', err);
        return res.redirect('/login');
    }); // Xóa session trong database
}; 