// Gọi các module lõi của NodeJs
const path = require('path');

// Gọi các module package
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

// Liên kết các file trong app
const rootDir = require('./util/path');
const authRoutes = require('./routes/auth');
const staffRoutes = require('./routes/staff');
const checkRoutes = require('./routes/check');
const salaryRoutes = require('./routes/salary');
const covidRoutes = require('./routes/covid');
const errorController = require('./controllers/error');
const Staff = require('./models/staff');

// Khai báo
const MONGODB_URI = 'mongodb://localhost:27017/appStaff'; // Uri liên kết mongodb
const app = express(); // Sử dụng framework express.js
const csrfProtection = csrf(); // Tạo csrfProtection

// Tạo 1 collection trong database
const store = new MongoDBStore({
    uri: MONGODB_URI, // Kết nối database (uri có tính duy nhất so với url, path (đường dẫn) là thuật ngữ chung của uri và url)
    collection: 'sessions' // Tạo collection 'session' trong database
}); // Tạo kho lưu trữ session trên database

// Thiết đặt sử dụng template
app.set(
    'view engine', // Khai báo sẽ sử dụng Template động cho view
    'ejs' // Template động là package ejs
);
app.set(
    'views', // Khai báo các view sẽ sử dụng template động
    'views' // Tại file views ngang hàng với file app.js
);

// Sử dụng các package
app.use(bodyParser.urlencoded(
    { extended: false }
)); // Nhận dữ liệu post từ client, gọi dữ liệu = req.body.<name>
app.use(express.static(path.join(
    rootDir, // Đường dẫn đến file chứa file app.js
    'public' // File chọn để truy cập tĩnh
))); // Xữ lý file public tĩnh cho trình duyệt truy cập (là các file .css, .js)
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
})); // Sử dụng session để bảo mật Cookie
app.use(csrfProtection); // Bảo vệ tấn công csrf
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn; // Biến xác thực người dùng có đăng nhập
    res.locals.csrfToken = req.csrfToken(); // Biến csrfToken cho tất cả các view
    next();
}); // res.locals là biến cục bộ thêm vào tất cả các view
app.use(flash()); // Sử dụng middleware flash trên đối tượng req dùng cho cả ứng dụng
app.use((req, res, next) => { // Nếu là không phải là manager thì thêm 1 property staff vào req
    if (!req.session.user) { // Bỏ qua nếu không đăng nhập
        return next();
    };
    if (!req.session.user.isManager) { // Bỏ qua nếu không phải là nhân viên
        return Staff
            .findOne({ 'user_id': req.session.user._id })
            .then(staff => {
                req.staff = staff; // Thêm prop req.staff để truy xuất tên
                req.session.searchValue = {
                    monthSalary: ''
                };
                return next();
            })
            .catch(err => {
                throw new Error(err);
            })
        ;
    } else req.staff = {};
    return next();
});

// Các Routes
app.use(staffRoutes);
app.use(checkRoutes);
app.use(salaryRoutes);
app.use(covidRoutes);
app.use(authRoutes);
app.use(errorController.get404); // Xử lý lổi 404

// Kết nối với database bằng mongoose
mongoose
    .connect(MONGODB_URI) // Kết nối database
    .then(() => {
        app.listen(3000); // Sử dụng cổng 3000 của localhost để chạy app
    })
    .catch(err => {
        console.log(err);
    })
;