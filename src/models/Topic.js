const { Schema, model } = require('mongoose');
const schema = new Schema({
    name: { type: String, required: true },
    liveClass: { type: 'ObjectId', ref: 'liveClass' },
    detail: { type: String, default: '' },
    img: { type: String, default: '' },
    time: { type: String },
    faculty: { type: String },
    meetingID: { type: String },
    meetingPasscode: { type: String },
    isActive: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = model('topic', schema);

