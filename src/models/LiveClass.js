const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: { type: String },
    courseID: [{ type: 'ObjectId', ref: 'course' }],
    detail: { type: String, default: '' },
    img: { type: String, default: '' },
    isActive: { type: Number, default: 0 },
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

module.exports = model('liveClass', schema);

