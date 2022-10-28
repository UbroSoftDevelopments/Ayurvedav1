const {Schema,model} = require('mongoose');
const schema = new Schema({
    name: { type: String, required: true, index: { unique: true }},
    courseID: { type: String, default:''},
    detail: { type: String, default:''},
    img:{type: String, default:''},
    isActive:{ type: Number,default:1}
},{ timestamps: true });

module.exports = model('subject', schema);