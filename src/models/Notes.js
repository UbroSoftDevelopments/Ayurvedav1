const { Schema, model } = require('mongoose');
const schema = new Schema({
    title: { type: String, required: true },
    desc: { type: String },
    docPath: { type: String },
    chapterID: { type: 'ObjectId', ref: 'chapter' },
    createdBy:{type: String, default:''},
    updatedBy:{type: String, default:''}
}, { timestamps: true });

module.exports = model('notes', schema);

/*

{
    "vimoID": "",
    "title": "",
    "duration": "",
    "faculty": "",
    "chapterID": ""
}  

*/