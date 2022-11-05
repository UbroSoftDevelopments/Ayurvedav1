const {Schema,model} = require('mongoose');
const schema = new Schema({
    name: { type: String, required: true, index: { unique: true }},
    courseID: [{type: String}],
    subjectID: [{type: String}],
    detail: { type: String, default:''},
    img:{type: String, default:''},
    isActive:{ type: Number,default:1}
},{ timestamps: true });

module.exports = model('subsubject', schema);

/*
{
    "name": "Subject2",
   "courseID": ["635baefe2a20af52b71ee8a0","635bb9a872a96466f2ea5a2b"],
   "subjectID":["635bb9b772a96466f2ea5a2d"],
   "detail": "OK",
   "img": "./imh1.png",
   "isActive": 1
}  
*/