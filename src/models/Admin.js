const {Schema,model} = require('mongoose');
const adminSchema = new Schema({
    name: {type: String, required: true },
    username: { type: String,required:true,index:{unique: true}},
    password: { type: String,required:true},
    profile: { type: String,default:''},
    isActive:{ type: Number,default:1}
},{ timestamps: true });

module.exports = model('admin', adminSchema);