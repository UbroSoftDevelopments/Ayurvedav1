const { Schema, model } = require('mongoose');
const schema = new Schema({
    studentID: { type: 'ObjectId', ref: 'student' },
    courseID: { type: 'ObjectId', ref: 'course' },
    subjectID: { type: 'ObjectId', ref: 'subject' },
    testSeriesID: { type: 'ObjectId', ref: 'testSeries' },
    paperList: [{ type: 'ObjectId', ref: 'testPaper' }],
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
}, { timestamps: true });

module.exports = model('studentPlan', schema);

