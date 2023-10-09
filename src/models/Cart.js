const { Schema, model } = require('mongoose');



const planSchema = new Schema({
    lable: { type: String },
    days: { type: Number },
    amount: { type: Number },
    gstRate: { type: Number },
    sacCode: { type: String }
})



const schema = new Schema({
    studentID: { type: 'ObjectId', ref: 'student' },
    courseID: { type: 'ObjectId', ref: 'course' },
    subjectList: [
        {
            subjectID: { type: 'ObjectId', ref: 'subject' },
            selectedPlan: planSchema
        }
    ],liveClassList: [
        {
            liveClassID: { type: 'ObjectId', ref: 'liveClass' },
            selectedPlan: planSchema
        }
    ],testSeriesList: [
        {
            testSeriesID: { type: 'ObjectId', ref: 'testSeries' },
            selectedPlan: planSchema
        }
    ]
}, { timestamps: true });

module.exports = model('cart', schema);

