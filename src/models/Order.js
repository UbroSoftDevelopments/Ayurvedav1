const { Schema, model } = require('mongoose');
const schema = new Schema({
    studentID: { type: 'ObjectId', ref: 'student' },
    totalAmount: { type: Number },
    merchantId: { type: String },
    note: { type: String },
    promoCode: { type: String },
    status: { type: String , default : 'PENDING'}, //"PAID","PENDING"
    orderPlan: {
        courseID: { type: 'ObjectId', ref: 'course' },
        subjectID: { type: 'ObjectId', ref: 'subject' },
        liveClassID: { type: 'ObjectId', ref: 'liveClass' },
        testSeriesID: { type: 'ObjectId', ref: 'testSeries' },
        paperList: [{ type: 'ObjectId', ref: 'testPaper' }],
        description: { type: String },
        expireDate: { type: Date },
        plan: {
            type: {
                lable: { type: String },
                days: { type: Number },
                amount: { type: Number },
                paymentMode: { type: String },
                gstRate: { type: Number },
                sacCode: { type: String }
            }
        }
    },
    createdBy: { type: String, default: '' },
    updatedBy: { type: String, default: '' }
}, { timestamps: true });

module.exports = model('order', schema);

