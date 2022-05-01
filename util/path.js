// Thư mục trợ giúp/ hàm trợ giúp đưa ta đường dẫn đến file chứa app.js
const path = require('path');

module.exports = path.dirname(require.main.filename);