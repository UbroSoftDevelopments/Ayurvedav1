const { Schema, model } = require('mongoose');
const schema = new Schema({
    courseID: { type: 'ObjectId', ref: 'course' },
    testSeriesID: { type: 'ObjectId', ref: 'testSeries' },
    paperID: { type: 'ObjectId', ref: 'testPaper', require: true },
    studentID: { type: 'ObjectId', ref: 'student', require: true },
    examStartTime: { type: Date, default: Date.now },
    examEndTime: { type: Date },
    examDone: { type: Number, default: 0 },
    questionList: [
        {
            qID: { type: 'ObjectId', ref: 'question' , unique: true },
            isCorrect: { type: Number },
            response: { type: String },
            qstatus: { type: String },
            createdAt: { type: Date, default: Date.now }
        }],
}, { timestamps: true });

module.exports = model('testResponse', schema);
