const { Schema, model } = require('mongoose');
const schema = new Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    subSubject: { type: String, required: true },
    desc: { type: String },
    sequence: { type: Number },
    noteTitle: { type: String },
    nodeDoc: { type: String },
    img: { type: String, default: '' }

}, { timestamps: true });

module.exports = model('chapter', schema);

/*
{
    
    "name":  "Chapter 1" ,
    "subject":  "Subject1" ,
    "subSubject":  "sub-Subject" ,
    "desc":  "details desc" ,
    "noteTitle":  "Note 1" ,
    "nodeDoc":  "8e2y.pdf   " ,
    "img":  "" 
}  
*/