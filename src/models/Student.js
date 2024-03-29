const { Schema, model } = require('mongoose');

const StudentSchema = new Schema({
    fullName: { type: String, required: true },
    mobile: { type: Number, required: true, index: { unique: true } },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    presentStatus: { type: String, default: "" },
    favSubject: { type: String, default: "" },
    referralCode: { type: String, default: "" },
    purposeOfAyurveda: { type: String, default: "" },
    isVerifed: { type: Number, default: 0 },


    profile: { type: String, default: '' },
    address: { type: String, default: '' },
    dist: { type: String, default: '' },
    pinCode: { type: Number, default: '' },
    collage: { type: String, default: '' },
    course: { type: String, default: '' },
    stream: { type: String, default: '' },
    type: { type: Number, default: 1 },
    date: { type: String, default: app.date() },
    isActive: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = model('student', StudentSchema);

/*
{
    "fullName" : "Manish Pal",
    "email":"manish@ubro.com",
    "password": "",
    "mobile":1234567890,
    "presentStatus":"BAMS 1st year",
    "favSubject":"One",
    "referralCode":"",
    "purposeOfAyurveda":"One"
}

*/