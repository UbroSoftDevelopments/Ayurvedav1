const { Schema, model } = require('mongoose');

const userSchema = new Schema({

    chapterID: { type: 'ObjectId', ref: 'chapter', required: true },
    question: { hindi: { type: String, required: true }, eng: { type: String, required: true }, type: { type: String } },
    opt1: { hindi: { type: String }, eng: { type: String }, isCorrect: { type: Number, default: 0 }, type: { type: String } },
    opt2: { hindi: { type: String }, eng: { type: String }, isCorrect: { type: Number, default: 0 }, type: { type: String } },
    opt3: { hindi: { type: String }, eng: { type: String }, isCorrect: { type: Number, default: 0 }, type: { type: String } },
    opt4: { hindi: { type: String }, eng: { type: String }, isCorrect: { type: Number, default: 0 }, type: { type: String } },
    tags: [{ type: String }],
    solution: { data: { type: String }, type: { type: String } },
    code: { type: String },
    courseID: { type: 'ObjectId', ref: 'course' },
    subjectID: { type: 'ObjectId', ref: 'subject' },
    subSubjectID: { type: 'ObjectId', ref: 'subsubject' },

}, { timestamps: true });

module.exports = model('question', userSchema);

