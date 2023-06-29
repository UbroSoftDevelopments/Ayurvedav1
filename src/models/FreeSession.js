const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: { type: String },
    mail: { type: String },
    phone: { type: String },
    isSeen: { type: Number, default: 0 },
    status: { type: String, default: 'Not Seen' },
    createdBy:{type: String, default:''},
    updatedBy:{type: String, default:''}

}, { timestamps: true });

module.exports = model('freeSession', userSchema);