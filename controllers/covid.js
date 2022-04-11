const Covid = require('../models/covid');

exports.getIndex = (req, res, next) => {
    const _id = req.params._id;
    const name = req.staffName;
    Covid
        .findById(_id)
        .then(cov => {
            if (!cov) {
                // Neu khong
                const covid = new Covid({
                    _id: _id,
                    vaccine: [],
                    datePositive: [],
                    tempBody: []
                })
                return covid.save();
            }
            return res.render(
                'MH-4', // Đến file MH-4 theo app.set là 'ejs', 'views'
                {
                    name: name,
                    covid: cov,
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
            cov.vaccine.push(newVac);
            return cov.save();
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
    const ngayXN = req.body.ngayXN;
    const datePos = new Date();
    
    Covid
        .findById(_id)
        .then((cov) => {
            if (ngayXN) {
                cov.datePositive.push(ngayXN);
                return cov.save();
            } else {
                cov.datePositive.push(datePos);
                return cov.save();
            }
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
    const ngayDoTem = req.body.ngayDoTem;
    let newTemp;

    if (ngayDoTem) {
        newTemp = {
            dateTemp: ngayDoTem,
            temp: req.body.nhietDo
        }
    } else {
        newTemp = {
            dateTemp: new Date(),
            temp: req.body.nhietDo
        }
    }
    
    Covid
        .findById(_id)
        .then((cov) => {
            cov.tempBody.push(newTemp);
            return cov.save();
        })
        .then(result => {
          console.log(result);
          res.redirect('/');
        })
        .catch(err => console.log(__dirname, err))
    ;
}