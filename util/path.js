// Thư mục trợ giúp/ hàm trợ giúp đưa ta đường dẫn đến file chứa app.js
const path = require('path');

module.exports = path.dirname(require.main.filename);

// 'https://phunugioi.com/wp-content/uploads/2020/10/hinh-anh-chibi-buon.jpg'