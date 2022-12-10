const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    courseID: { type: 'ObjectId', ref: 'course' },
    subjectID: { type: 'ObjectId', ref: 'subject' },
    subSubjectID: { type: 'ObjectId', ref: 'subsubject' },
    chapterID: { type: 'ObjectId', ref: 'chapter' },
    title: { type: String, required: true },
    img: { type: String },
    desc: { type: String },
    totalQuestions: { type: Number },
    totalMarks: { type: Number },
    perQMarks: { type: Number },
    perQNegMarks: { type: Number },
    cutoff: { type: Number },
    duration: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
}, { timestamps: true });

module.exports = model('testPaper', userSchema);
