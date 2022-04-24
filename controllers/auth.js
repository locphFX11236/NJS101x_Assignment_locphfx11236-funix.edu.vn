const Staff = require('../models/staff');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    Staff
        .findById('62593a36ceef9bb0c8c3ec7b')
        .then(staff => {
            req.session.isLoggedIn = true;
            req.session.staff = staff;
            req.session.save(err => {
                console.log(__dirname, '1',err);
                res.redirect('/');
            });
        })
        .catch(err => {
            console.log(err);
        })
    ;
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(__dirname, '2', err);
        res.redirect('/');
    });
}; 