const { Schema, model } = require('mongoose');
const schema = new Schema({
    studentID: { type: 'ObjectId', ref: 'student' },
    courseID: { type: 'ObjectId', ref: 'course' },
    subjectID: { type: 'ObjectId', ref: 'subject' },
    plan: {
        type: {
            lable: { type: String },
            days: { type: Number },
            amount: { type: Number }
        }
    }
}, { timestamps: true });

module.exports = model('studentPlan', schema);

