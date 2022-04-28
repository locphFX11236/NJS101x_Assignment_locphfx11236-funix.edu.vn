const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login'
    });
};

exports.postLogin = (req, res, next) => {
    const userId = req.body.userId;
    const password = req.body.password;
    User
        .findOne({userId: userId})
        .then(user => {
            if (!user) {
                return res.redirect('/404');
            } else if (user.password === password) {
                const session = req.session; // Vào database tạo 1 session
                // Add các giá trị vào session
                session.isLoggedIn = true;
                session.user = user;
                return session.save(err => {
                    console.log(__dirname, '1',err);
                    res.redirect('/');
                }); // Lưu session vào database
            } else {
                return res.redirect('/404');
            }
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