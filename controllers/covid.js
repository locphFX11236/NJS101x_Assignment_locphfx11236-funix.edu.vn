const Covid = require('../models/covid');
const Staff = require('../models/staff');

exports.getIndex = (req, res, next) => {
    const _id = req.params._id;
    Staff
        .findById(_id)
        .then(staff => {
            return res.render(
                'MH-4', // Đến file MH-4 theo app.set là 'ejs', 'views'
                {
                    staff: staff,
                    pageTitle: 'Thông tin covid-19', // Page Title
                    path: '/covid', // Để truy cập view trên trình duyệt
                }
            );
        })
        .catch(err => {
            console.error(__dirname, "10", err);
        })
    ;
}

exports.postVaccine = (req, res, next) => {
    const _id = req.body._id;
    const newVac = {
        dateVac: req.body.ngayTiem,
        typeVac: req.body.loaiVaccine
    }
    
    Covid
        .findById(_id)
        .then((cov) => {
            // Xet cov co ton tai ko?
            if (!cov) {
                // Neu khong
                const covid = new Covid({
                    _id: _id,
                    vaccine: [],
                    datePositive: [],
                    tempBody: []
                })
                covid.vaccine.push(newVac);
                return covid.save();
            } else {
                // Neu co
                cov.vaccine.push(newVac);
                return cov.save();
            };
        })
        .then(result => {
          console.log(result);
          res.redirect('/');
        })
        .catch(err => console.log(__dirname, err))
    ;
}

exports.postXN = (req, res, next) => {
    const _id = req.body._id;
    const datePos = new Date();
    
    Covid
        .findById(_id)
        .then((cov) => {
            // Xet cov co ton tai ko?
            if (!cov) {
                // Neu khong
                const covid = new Covid({
                    _id: _id,
                    vaccine: [],
                    datePositive: [],
                    tempBody: []
                })
                covid.datePositive.push(datePos);
                return covid.save();
            } else {
                // Neu co
                cov.datePositive.push(datePos);
                return cov.save();
            };
        })
        .then(result => {
          console.log(result);
          res.redirect('/');
        })
        .catch(err => console.log(__dirname, err))
    ;
}

exports.postND = (req, res, next) => {
    const _id = req.body._id;
    const newTemp = {
        dateTemp: new Date(),
        temp: req.body.nhietDo
    }
    
    Covid
        .findById(_id)
        .then((cov) => {
            // Xet cov co ton tai ko?
            if (!cov) {
                // Neu khong
                const covid = new Covid({
                    _id: _id,
                    vaccine: [],
                    datePositive: [],
                    tempBody: []
                })
                covid.tempBody.push(newTemp);
                return covid.save();
            } else {
                // Neu co
                cov.tempBody.push(newTemp);
                return cov.save();
            };
        })
        .then(result => {
          console.log(result);
          res.redirect('/');
        })
        .catch(err => console.log(__dirname, err))
    ;
}