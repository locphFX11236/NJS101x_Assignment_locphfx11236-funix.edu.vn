const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const p = path.join(
    rootDir,
    'data',
    'covid-19.json'
);

const getCovidFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Covid {
    constructor(id, vaccin, sucKhoe) {
        this.id = id;
        this.vaccin = vaccin;
        this. sucKhoe = sucKhoe;
    }

    static vaccine(id, loaiVaccine, ngayTiem) {
        getCovidFromFile(covids => {
            const covid = covids.find(covids => covids.id === id);
            const newVaccine = {
                "ngayTiem": ngayTiem,
                "loaiVaccine": loaiVaccine
            };
            covid.vaccine.push(newVaccine);
            fs.writeFile(
                p,
                JSON.stringify(covids),
                err => console.log(__dirname, "2", err)
            );
        });
    }

    static xetNghiem(id, ngay) {
        getCovidFromFile(covids => {
            const covid = covids.find(covids => covids.id === id);
            const newXN = { "ngay": ngay };
            covid.duongTinh.push(newXN);
            fs.writeFile(
                p,
                JSON.stringify(covids),
                err => console.log(__dirname, "3", err)
            );
        });
    }

    static nhietDo(id, nhietDo, ngay) {
        getCovidFromFile(covids => {
            const covid = covids.find(covids => covids.id === id);
            const newND = {
                "ngay": ngay,
                "nhietDo": nhietDo
            };
            covid.nhietDo.push(newND);
            console.log(covids)
            fs.writeFile(
                p,
                JSON.stringify(covids),
                err => console.log(__dirname, "4", err)
            );
        });
    }

    static findById(id, cb) {
        getCovidFromFile(staffs => {    
            const staff = staffs.find(staffs => staffs.id === id);
            return cb(staff);
        });
    }
}