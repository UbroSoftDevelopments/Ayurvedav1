const { Schema, model } = require('mongoose');
const schema = new Schema({
    name: { type: String, required: true, index: { unique: true } },
    subjectID: { type: 'ObjectId', ref: 'subject' },
    detail: { type: String, default: '' },
    img: { type: String, default: '' },
    sequence: { type: Number },
    isDemo: { type: Number, default: 0 },
    chapterID: [{ type: 'ObjectId', ref: 'chapter' }],
    isActive: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = model('subsubject', schema);

/*
{
    "name": "subjSubject2",
   "subjectID":"635bb9b772a96466f2ea5a2d",
   "detail": "OK",
   "img": "./imh1.png",
   "isActive": 1
}  
*/