const {Schema,model} = require('mongoose');
const adminSchema = new Schema({
    type: { type: String,default:'',required:true},
    amount:{ type: Number,default:0}
},{ timestamps: true });

module.exports = model('plan', adminSchema);