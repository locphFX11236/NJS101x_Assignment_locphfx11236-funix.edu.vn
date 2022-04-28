// Gọi các module lõi của NodeJs
const path = require('path');

// Gọi các module package
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

// Liên kết các file trong app
const rootDir = require('./util/path');
const staffRoutes = require('./routes/staff');
const checkRoutes = require('./routes/check');
const salaryRoutes = require('./routes/salary');
const covidRoutes = require('./routes/covid');
const errorController = require('./controllers/error');
const authRoutes = require('./routes/auth');
const Staff = require('./models/staff');
const User = require('./models/user');

const MONGODB_URI = 'mongodb://localhost:27017/appStaff'; // Uri liên kết mongodb
const app = express(); // Sử dụng framework express.js
const store = new MongoDBStore({
    uri: MONGODB_URI, // Kết nối database
    collection: 'sessions' // Tạo collection 'session' trong database
}); // Tạo kho lưu trữ session trên database
const csrfProtection = csrf(); // Tạo csrfProtection

// Thiết đặt sử dụng template
app.set(
    'view engine', // Khai báo Template động nào sử dụng
    'ejs' // Là ejs
);
app.set(
    'views', // Khai báo vị trí file chứa template động
    'views' // Tại file views
);

// Sử dụng các package
app.use(bodyParser.urlencoded(
    { extended: false }
)); // Nhận dữ liệu post từ client, gọi dữ liệu = req.body.<name>
app.use(express.static(path.join(
    rootDir,
    'public'
))); // Xữ lý file public tĩnh cho trình duyệt truy cập (là các file .css, .js)
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
})); // Sử dụng session để bảo mật Cookie
app.use(csrfProtection); // Bảo vệ tấn công csrf
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn; // Biến xác thực
    res.locals.csrfToken = req.csrfToken(); // Biến csrfToken
    next();
}); // res.locals là biến cục bộ thêm vào tất cả các view

// Các Routes
app.use(staffRoutes);
// app.use(checkRoutes);
// app.use(salaryRoutes);
// app.use(covidRoutes);
app.use(authRoutes);
app.use(errorController.get404); // Xử lý lổi 404

// Kết nối với database bằng mongoose
mongoose
    .connect(MONGODB_URI) // Kết nối database
    .then(result => {
        app.listen(3000); // Sử dụng cổng 3000 của localhost để chạy app
    })
    .catch(err => {
        console.log(err);
    })
;