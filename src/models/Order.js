const { Schema, model } = require('mongoose');

const schema = new Schema({
    studentID: { type: 'ObjectId', ref: 'student' },
    paidAmount: { type: Number },//
    totalAmount: { type: Number },//
    pendingAmount: { type: Number },//
    merchantId: { type: String },
    discount:{type : Number,default: 0},
    note: { type: String },
    transactionMode: { type: String },
    promoCode: { type: String },
    status: { type: String , default : 'PAID'}, //"PAID","PENDING","CANCEL"
    createdBy: { type: String, default: '' },
    updatedBy: { type: String, default: '' }
}, { timestamps: true });

module.exports = model('order', schema);

