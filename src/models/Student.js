const {Schema,model} = require('mongoose');

const StudentSchema = new Schema({
    firstName:{type: String, required: true },
    lastName: {type: String, },
    mobile:{ type: Number, required: true, index:{unique: true}},
    email: { type: String,required: true,index:{unique: true}},
    //username: { type: String,required:true,index:{unique: true}},
    password: { type: String,required:true},
    profile: { type: String,default:''},
    address:{ type: String,default:''},
    dist:{ type: String,default:''},
    pinCode:{ type: Number,default:''},
    collage:{ type: String,default:''},
    course:{ type: String,default:''},
    stream:{ type: String,default:''},
    type: { type: Number,default:1},
    date: { type: String,default:app.date()},
    isActive:{ type: Number,default:1},
     },{ timestamps: true });

module.exports = model('student', StudentSchema);