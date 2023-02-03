const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: { type: String, required: true },
    paperID: [{ type: 'ObjectId', ref: 'testPaper' }],
    courseID: [{ type: 'ObjectId', ref: 'course' }],
    desc: { type: String, default: '' },
    img: { type: String, default: '' },
    isActive: { type: Number, default: 0 },
    sequence: { type: Number },
    activeDate: { type: Date },
    deactiveDate: { type: Date },
    plan: [{
        lable: { type: String },
        days: { type: Number },
        amount: { type: Number },
        gstRate: { type: Number },
        sacCode: { type: String },
        paymentMode: { type: String },
    }]
}, { timestamps: true });

module.exports = model('testSeries', schema);
