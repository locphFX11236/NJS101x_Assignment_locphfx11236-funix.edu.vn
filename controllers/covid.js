const Covid = require('../models/covid');
const handle = require('../models/handle');

exports.getIndex = (req, res, next) => {
    const staff_id = req.params.staff_id;
    const user = req.session.user;

    Covid
        .findOne({ 'staff_id': staff_id })
        .then(cov => {
            if (!cov) {
                const newCovid = new Covid({
                    staff_id: _id,
                    vaccine: [],
                    datePositive: [],
                    tempBody: []
                });
                newCovid.save();
                return newCovid;
            }
            return cov;
        })
        .then(cov => {
            return res.render(
                'MH-4', // Đến file MH-4 theo app.set là 'ejs', 'views'
                {
                    covids: cov,
                    user: user,
                    pageTitle: 'Thông tin covid-19', // Page Title
                    path: '/covid/:staff_id' // Để truy cập view trên trình duyệt
                }
            );
        })
        .catch(err => {
            console.error('GET COVID INFORMATION! ERROR: ', err);
        })
    ;
}

exports.postVaccine = async (req, res, next) => {
    const _id = req.body._id;
    const staff_id = req.body.staff_id;
    const dateVac = req.body.ngayTiem.toString();
    const typeVac = req.body.loaiVaccine;
    const newVac = {
        dateVac: dateVac,
        typeVac: typeVac
    }
    
    return Covid
        .findById(_id)
        .then((cov) => {
            cov.vaccine.push(newVac);
            return cov.save();
        })
        .then(() => {
            console.log('ADDED!');
            return res.redirect('/covid/' + staff_id);
        })
        .catch(err => console.log('ADD VACCINE! ERROR: ', err))
    ;
}

exports.postXN = async (req, res, next) => {
    const _id = req.body._id;
    const staff_id = req.body.staff_id;
    const ngayXN = req.body.ngayXN.toString();
    const datePos = handle.handleTime.D_M_YPrint();
    
    return Covid
        .findById(_id)
        .then((cov) => {
            if (!ngayXN) {
                cov.datePositive.push(datePos);
                return cov.save();
            } else {
                cov.datePositive.push(ngayXN);
                return cov.save();
            }
        })
        .then(() => {
            console.log('ADDED!');
            return res.redirect('/covid/' + staff_id);
        })
        .catch(err => console.log('NOT ADD!', err))
    ;
}

exports.postND = (req, res, next) => {
    const _id = req.body._id;
    const staff_id = req.body.staff_id;
    const ngayDoTem = req.body.ngayDoTem.toString();
    const dateTemp = handle.handleTime.D_M_YPrint();
    let newTemp;

    if (ngayDoTem) {
        newTemp = {
            dateTemp: ngayDoTem,
            temp: req.body.nhietDo
        }
    } else {
        newTemp = {
            dateTemp: dateTemp,
            temp: req.body.nhietDo
        }
    }
    
    return Covid
        .findById(_id)
        .then((cov) => {
            cov.tempBody.push(newTemp);
            return cov.save();
        })
        .then(() => {
            console.log('ADDED!');
            return res.redirect('/covid/' + staff_id);
        })
        .catch(err => console.log('NOT ADD!', err))
    ;
}