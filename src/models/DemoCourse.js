const {Schema,model} = require('mongoose');

const userSchema = new Schema({
    categoryId: { type: String, required: true },
    branchId: { type: String, required: true},
    url: { type: String,default:''},
    title: { type: String,default:''},
    poster:{ type: String,default:''},
    type: { type: Number,default:1},
    date: { type: String, default:Date.now()},
    extra:{ type: Number,default:1},
    isActive:{ type: Number,default:1},
    createdBy:{type: String, default:''},
    updatedBy:{type: String, default:''}
},{ timestamps: true });

module.exports = model('demo', userSchema);