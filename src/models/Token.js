const { Schema, model } = require('mongoose');

const schema = new Schema({
    token: { type: String },
    studentID:{ type: 'ObjectId', ref: 'student' }
});

module.exports = model('token', schema);