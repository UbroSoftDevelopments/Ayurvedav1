const {Schema,model} = require('mongoose');
const schema = new Schema({
    vimoID: { type: String, required: true},
    title: { type: String, required: true},
    duration: { type: String, required: true},
    faculty: { type: String},
    chapterID: {type:'ObjectId',ref:'chapter'},
},{ timestamps: true });

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