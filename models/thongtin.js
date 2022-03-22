const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const p = path.join(
    rootDir,
    'data',
    'nhanvien.json'
);

const getStaffsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Thongtin {
    constructor(
        id,
        imageUrl,
        name,
        doB,
        salaryScale,
        startDate,
        department,
        annualLeave,
    ) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.name = name;
        this.doB = doB;
        this.salaryScale = salaryScale;
        this.startDate = startDate;
        this.department = department;
        this.annualLeave = annualLeave;
    }

    static editImg(id, imageUrl) {
        getStaffsFromFile(staffs => {
            const staff = staffs.find(staffs => staffs.id === id);
            const updatedStaff = [...staffs];
            staff.imageUrl = imageUrl;
            updatedStaff[staff] = this;
            fs.writeFile(
                p,
                JSON.stringify(updatedStaff),
                err => console.log(__dirname, "1", err)
            );
        });
    }

    static fetchAll(cb) {
        getStaffsFromFile(cb);
    }

    static findById(id, cb) {
        getStaffsFromFile(staffs => {
            const staff = staffs.find(staffs => staffs.id === id);
            return cb(staff);
        });
    }
}