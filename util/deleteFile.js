const fs = require('fs');

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => { // fs.unlink là xóa file bằng đường link
        if (err) {
            throw Error(err);
        };
    });
};

exports.deleteFile = deleteFile;