const { Schema, model } = require('mongoose');
const schema = new Schema({
    mobile: { type: Number },
    otp: { type: Number },


}, { timestamps: true });

schema.index({ "expireAt": 1 }, { expireAfterSeconds: 300 });


module.exports = model('otp', schema);