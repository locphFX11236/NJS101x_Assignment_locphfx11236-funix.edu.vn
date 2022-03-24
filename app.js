const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const rootDir = require('./util/path');
const routes = require('./routes/routes');
const diemdanhs = require('./routes/diemdanh');
const salarys = require('./routes/salary');
const covids = require('./routes/covid-19');
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;

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

app.use(routes);
app.use(diemdanhs);
app.use(salarys);
app.use(covids);

app.use(errorController.get404); // Xử lý lổi 404

mongoConnect(() => {
    app.listen(3000);
}); // Kết nối với mongodb