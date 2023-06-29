const { Schema, model } = require('mongoose');
const schema = new Schema({
    testSeriesID: { type: 'ObjectId', ref: 'testSeries' },
    paperID: { type: 'ObjectId', ref: 'testPaper' },
    studentID: { type: 'ObjectId', ref: 'student', index: true },
    qID: { type: 'ObjectId', ref: 'question' },
    createdBy:{type: String, default:''},
    updatedBy:{type: String, default:''}
}, { timestamps: true });

//schema.index({ 'studentID': 1, 'qID': 1 }, { unique: true });

module.exports = model('taskQuestion', schema);

