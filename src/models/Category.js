const {Schema,model} = require('mongoose');
const schema = new Schema({
    name: { type: String, required: true, index: { unique: true }},
    tab: { type: String, default:''},
    detail: { type: String, default:''},
    img:{type: String, default:''},
    isActive:{ type: Number,default:1},
    createdBy:{type: String, default:''},
    updatedBy:{type: String, default:''}
},{ timestamps: true });

module.exports = model('category', schema);


/*

{
    "name": "Cateogary2",
    "title": "Lets Do it",
    "detail": "",
    "img": "./img/ok.png",
    "isActive": 1
}

*/
