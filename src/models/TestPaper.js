const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    // courseID: { type: 'ObjectId', ref: 'course' },
    // subjectID: { type: 'ObjectId', ref: 'subject' },
    // subSubjectID: { type: 'ObjectId', ref: 'subsubject' },
    chapterID: { type: 'ObjectId', ref: 'chapter' },
    practiseChapIDList: [{ type: 'ObjectId', ref: 'chapter' }],
    title: { type: String, required: true },
    img: { type: String, default: '' },
    desc: { type: String },
    totalQuestions: { type: Number },
    totalMarks: { type: Number },
    perQMarks: { type: Number, default: 1 },
    perQNegMarks: { type: Number, default: 0 },
    cutoff: { type: Number },
    duration: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    rankStartDate: { type: Date },
    rankEndDate: { type: Date },
    qType: { type: String, required: true },
    isActive: { type: Number, default: 0 },
    questionList: [{ type: 'ObjectId', ref: 'question' }]
}, { timestamps: true });

module.exports = model('testPaper', userSchema);
