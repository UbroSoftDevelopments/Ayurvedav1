const { Schema, model } = require('mongoose');
const schema = new Schema({
    vimoID: { type: String, required: true },
    sequence: { type: Number },
    title: { type: String, required: true },
    duration: { type: String, required: true },
    chapterID: { type: 'ObjectId', ref: 'chapter' },
    createdBy:{type: String, default:''},
    updatedBy:{type: String, default:''}
}, { timestamps: true });

module.exports = model('video', schema);

/*

{
    "vimoID": "",
    "title": "",
    "duration": "",
    "faculty": "",
    "chapterID": ""
}  

*/