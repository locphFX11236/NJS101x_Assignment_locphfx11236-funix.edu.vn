const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const staffSchema = new Schema({
    imageUrl: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    doB: {
        type: Date,
        required: true
    },
    salaryScale: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    annualLeave: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Staff', staffSchema);
// const mongodb = require('mongodb');

// const getDb = require('../util/database').getDb;

// module.exports = class Thongtin {
//     constructor(
//         _id,
//         imageUrl,
//         name,
//         doB,
//         salaryScale,
//         startDate,
//         department,
//         annualLeave,
//     ) {
//         this._id = _id ? new mongodb.ObjectId(_id) : null;
//         this.imageUrl = imageUrl;
//         this.name = name;
//         this.doB = doB;
//         this.salaryScale = salaryScale;
//         this.startDate = startDate;
//         this.department = department;
//         this.annualLeave = annualLeave;
//     }

//     save() {
//         const db = getDb();
//         let dbOp;
//         if (this._id) {
//             dbOp = db
//                 .collection('staffs')
//                 .updateMany(
//                     { _id: this._id },
//                     { $set: this }  
//                 )
//             ;
//         } else {
//             dbOp = db
//                 .collection('staffs')
//                 .insertOne(this)
//             ;
//         }
//         return dbOp
//             .then(result => {
//                 console.log(__dirname, "9", result);
//             })
//             .catch((error) => {
//                 console.log(__dirname, "5", error);
//             })
//         ;
//     }

//     static fetchAll() {
//         const db = getDb();
//         return db
//             .collection('staffs')
//             .find()
//             .toArray()
//             .then(staffs => {
//                 return staffs;
//             })
//             .catch ((error) => {
//                 console.log(__dirname, "7", error);
//             })
//         ;
//     }

//     static findById(id) {
//         const db = getDb();
//         return db
//           .collection('staffs')
//           .find({ _id: new mongodb.ObjectId(id) })
//           .next()
//           .then(staffs => {
//             return staffs;
//           })
//           .catch(err => {
//             console.log(__dirname, "8", error);
//           })  
//         ;
//     }
// }