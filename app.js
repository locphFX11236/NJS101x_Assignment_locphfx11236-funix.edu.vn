const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const rootDir = require('./util/path');
const staffRoutes = require('./routes/staff');
const checkRoutes = require('./routes/check');
const salaryRoutes = require('./routes/salary');
const covidRoutes = require('./routes/covid');
const errorController = require('./controllers/error');
const authRoutes = require('./routes/auth');
const Staff = require('./models/staff');

const MONGODB_URI = 'mongodb://localhost:27017/appQuanLy';
const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set(
    'view engine', // Khai báo Template động nào sử dụng
    'ejs' // Là ejs
);
app.set(
    'views', // Khai báo vị trí file chứa template động
    'views' // Tại file views
);

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
}));

app.use((req, res, next) => {
    if (!req.session.staff) {
        return next();
    };
    Staff
        .findById(req.session.staff._id)
        .then(staff => {
            req.staffName = staff.name;
            req.staffHSL = staff.salaryScale;
            next();
        })
        .catch(err => {
            console.log(err);
        })
    ;
}); // Sử dụng Staff data

app.use(staffRoutes);
app.use(checkRoutes);
app.use(salaryRoutes);
app.use(covidRoutes);
app.use(authRoutes);

app.use(errorController.get404); // Xử lý lổi 404

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })
; // Kết nối với mongoose