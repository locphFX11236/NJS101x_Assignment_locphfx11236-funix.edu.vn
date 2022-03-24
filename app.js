const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const rootDir = require('./util/path');
const staffs = require('./routes/staff');
const diemdanhs = require('./routes/diemdanh');
const salarys = require('./routes/salary');
const covids = require('./routes/covid-19');
const errorController = require('./controllers/error');

const app = express();

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

app.use(staffs);
app.use(diemdanhs);
app.use(salarys);
app.use(covids);

app.use(errorController.get404); // Xử lý lổi 404

mongoose
    .connect(
        'mongodb://localhost:27017/appQuanLy'
    )
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })
; // Kết nối với mongoose