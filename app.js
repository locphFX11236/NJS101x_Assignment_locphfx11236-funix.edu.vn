const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes/routes');
const rootDir = require('./util/path');
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
))); // Xữ lý file public tĩnh cho trình duyệt truy cập (là các file .css)

app.use(routes);

app.use(errorController.get404); // Xử lý lổi 404

app.listen(3000);