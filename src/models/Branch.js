const {Schema,model} = require('mongoose');
const schema = new Schema({
    categoryId: { type: String , required: true},
    name: { type: String, required: true, index: { unique: true }},
    title: { type: String, default:''},
    detail: { type: String, default:''},
    isActive:{ type: Number,default:1}
},{ timestamps: true });

module.exports = model('branch', schema);