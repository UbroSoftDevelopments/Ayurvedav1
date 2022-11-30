const { Schema, model } = require('mongoose');
const schema = new Schema({
    name: { type: String, required: true, index: { unique: true } },
    categoryID: { type: 'ObjectId', ref: 'category' },
    detail: { type: String, default: '' },
    img: { type: String, default: '' },
    sequence: { type: Number },
    isActive: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = model('course', schema);

/*
{
    "name": "Subject2",
   "categoryID": "635baefe2a20af52b71ee8a0",
   "detail": "OK",
   "img": "./imh1.png",
   "isActive": 1
}  
*/