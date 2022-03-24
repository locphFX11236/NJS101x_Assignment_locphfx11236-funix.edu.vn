const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const p = path.join(
    rootDir,
    'data',
    'diemdanh.json'
);

const getCheckFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class DiemDanh {
    constructor(id, state, begin, end, at) {
        this.id = id;
        this.state = state;
        this.working.begin = begin;
        this.working.end = end;
        this.working.at = at;
    }

    static fetchAll(cb) {
        getCheckFromFile(cb);
    }
}