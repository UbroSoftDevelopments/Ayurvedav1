const { Schema, model } = require('mongoose');
const schema = new Schema({

    testSeriesID: { type: 'ObjectId', ref: 'testSeries', require: true },
    paperID: { type: 'ObjectId', ref: 'testPaper', require: true },
    studentID: { type: 'ObjectId', ref: 'student', require: true },
    qID: { type: 'ObjectId', ref: 'question', require: true },
    comment: { type: String, default: 0 },
    img: { type: String, default: 0 },
    status: { type: String, default: 'Pending' },
    solve: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = model('reportQuestion', schema);
