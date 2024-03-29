const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: { type: String },
    courseID: [{ type: 'ObjectId', ref: 'course' }],
    detail: { type: String, default: '' },
    img: { type: String, default: '' },
    isActive: { type: Number, default: 0 },
    sequence: { type: Number },
    plan: [{
        lable: { type: String },
        days: { type: Number },
        amount: { type: Number },
        gstRate: { type: Number },
        sacCode: { type: String },
        paymentMode: { type: String }
    }],
    createdBy:{type: String, default:''},
    updatedBy:{type: String, default:''}
}, { timestamps: true });

module.exports = model('subject', schema);


/*
{
    "name": "Subject2",
   "courseID": ["635baefe2a20af52b71ee8a0","635bb9a872a96466f2ea5a2b"],
   "detail": "OK",
   "img": "./imh1.png",
   "isActive": 1,
   "plan":[{
    "type":"Monthly",
    "amount":00,
    "days":30
   }]
}  
*/ 