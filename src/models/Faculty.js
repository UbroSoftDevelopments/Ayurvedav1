const { Schema, model } = require('mongoose');
const schema = new Schema({
    name: { type: String },
    qualification: { type: String },
    specializtion: { type: String },
    designation: { type: String },
    img: { type: String },
    detail: { type: String },

}, { timestamps: true });

module.exports = model('faculty', schema);