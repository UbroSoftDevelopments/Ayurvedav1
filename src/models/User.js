const {Schema,model} = require('mongoose');

const userSchema = new Schema({
    name: { type: String, required: true },
    mobile: { type: Number, required: true, index:{unique: true}},
    email: { type: String,default:''},
    username: { type: String,required:true,index:{unique: true}},
    password: { type: String,required:true},
    profile: { type: String,default:''},
    type: { type: Number,default:1},
    date: { type: String,default:app.date()},
    isActive:{ type: Number,default:1},
    createdBy:{type: String, default:''},
    updatedBy:{type: String, default:''}
},{ timestamps: true });

module.exports = model('user', userSchema);