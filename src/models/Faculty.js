const { Schema, model } = require('mongoose');
const schema = new Schema({
    name: { type: String },
    qualification: { type: String },
    specializtion: { type: String },
    designation: { type: String },
    img: { type: String },
    detail: { type: String },
    createdBy:{type: String, default:''},
    updatedBy:{type: String, default:''}

}, { timestamps: true });

module.exports = model('faculty', schema);