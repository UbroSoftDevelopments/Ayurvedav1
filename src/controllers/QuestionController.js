const db = require("../models");

class QuestionController {

    async addQuestion(req, res) {

        var { chapterID, question, opt1, opt2, opt3, opt4, tags, samhitaTag, subjectTag, patternTag, solution, code, courseID, subjectID, subSubjectID, level, qType, correctOpt } = req.body;
        if (!question || !opt1 || !opt2 || !opt3 || !opt4 || !qType)
            return res.json({
                status: false,
                message: "Feilds are required for question",
                data: null,
            });

        try {
            var questiondb = new db.Question();
            questiondb.chapterID = chapterID;
            questiondb.question = question;
            questiondb.opt1 = opt1;
            questiondb.opt2 = opt2;
            questiondb.opt3 = opt3;
            questiondb.opt4 = opt4;
            questiondb.correctOpt = correctOpt;
            questiondb.tags = tags;
            questiondb.samhitaTag = samhitaTag;
            questiondb.patternTag = patternTag;
            questiondb.subjectTag = subjectTag;
            questiondb.level = level;
            questiondb.solution = solution;
            questiondb.code = code;
            questiondb.courseID = courseID;
            questiondb.subjectID = subjectID;
            questiondb.subSubjectID = subSubjectID;
            questiondb.qType = qType;

            questiondb.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "new Question added",
                        data: questiondb,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async getQuestion(req, res) {
        try {
            const question = await db.Question.find();
            return res
                .status(200)
                .json({ status: true, message: `question list`, data: question });
        } catch (err) {
            return res
                .status(200)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async updateQuestion(req, res) {
        var { _id, chapterID, question, opt1, opt2, opt3, opt4, tags, samhitaTag, subjectTag, patternTag, solution, code, courseID, subjectID, subSubjectID, level, qType, correctOpt } = req.body;
        if (!_id || !question || !opt1 || !opt2 || !opt3 || !opt4 || !qType)
            return res.json({
                status: false,
                message: "Feilds are required for question",
                data: null,
            });
        try {
            var questiondb = await db.Question.findOne({ _id });

            if (chapterID) questiondb.chapterID = chapterID;
            if (question) questiondb.question = question;
            if (opt1) questiondb.opt1 = opt1;
            if (opt2) questiondb.opt2 = opt2;
            if (opt3) questiondb.opt3 = opt3;
            if (opt4) questiondb.opt4 = opt4;
            if (correctOpt) questiondb.correctOpt = correctOpt;
            if (tags) questiondb.tags = tags;
            if (level) questiondb.level = level;
            if (samhitaTag) questiondb.samhitaTag = samhitaTag;
            if (patternTag) questiondb.patternTag = patternTag;
            if (subjectTag) questiondb.subjectTag = subjectTag;
            if (qType) questiondb.qType = qType;
            if (solution) questiondb.solution = solution;
            if (code) questiondb.code = code;
            if (courseID) questiondb.courseID = courseID;
            if (subjectID) questiondb.subjectID = subjectID;
            if (subSubjectID) questiondb.subSubjectID = subSubjectID;


            questiondb.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Question updated 👍",
                        data: questiondb,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async deleteQuestion(req, res) {
        var _id = req.params.id;


        try {
            var questiondb = await db.Question.findOne({ _id });

            questiondb.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Question deleted",
                        data: questiondb,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async getQuestionByChapterId(req, res) {

        const id = req.params.id;
        try {
            const questiontbl = await db.Question.find({ 'chapterID': id });
            return res
                .status(200)
                .json({ status: true, message: `Question list`, data: questiontbl });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }

    }

    async getQuestionById(req, res) {

        const id = req.params.id;
        try {
            const questiontbl = await db.Question.findOne({ '_id': id });
            return res
                .status(200)
                .json({ status: true, message: `Question `, data: questiontbl });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }

    }

}

module.exports = QuestionController;