const { Schema, model } = require('mongoose');
const schema = new Schema({

    courseID: { type: 'ObjectId', ref: 'course' },
    oneSub: { type: Number, default: 0 },
    moreSub: { type: Number, default: 0 },
    allSub: { type: Number, default: 0 }


}, { timestamps: true });

module.exports = model('discount', schema);


// oneSub => one subject selected discount
// moreSub => more then one and less then all
// allSub => All Subject