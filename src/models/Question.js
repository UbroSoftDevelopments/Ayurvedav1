const { Schema, model } = require('mongoose');

const userSchema = new Schema({

    chapterID: { type: 'ObjectId', ref: 'chapter' },
    question: { hindi: { type: String, required: true }, eng: { type: String, required: true }, type: { type: String, default: 'html' } },
    opt1: { hindi: { type: String }, eng: { type: String }, type: { type: String, default: 'text' } },
    opt2: { hindi: { type: String }, eng: { type: String }, type: { type: String, default: 'text' } },
    opt3: { hindi: { type: String }, eng: { type: String }, type: { type: String, default: 'text' } },
    opt4: { hindi: { type: String }, eng: { type: String }, type: { type: String, default: 'text' } },
    tags: [{ type: String }],
    level: { type: String },
    correctOpt: { type: Number },
    solution: { data: { type: String }, type: { type: String, default: 'text' } },
    code: { type: String },
    courseID: { type: 'ObjectId', ref: 'course' },
    subjectID: { type: 'ObjectId', ref: 'subject' },
    subSubjectID: { type: 'ObjectId', ref: 'subsubject' },
    qType: { type: String }
}, { timestamps: true });

module.exports = model('question', userSchema);

// For testSeries
// For practiceTest
// For dailyQuiz