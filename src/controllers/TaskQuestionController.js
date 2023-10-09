const db = require("../models");

class TaskQuestionController {


    /* Video */

    async addTaskQuestion(req, res) {

        var { testSeriesID, paperID, qID } = req.body;
        var studentID = req.userId

        if (!studentID, !qID)
            return res.json({
                status: false,
                message: "key required for Task",
                data: null,
            });

        try {
            var task = new db.TaskQuestion();
            task.testSeriesID = testSeriesID;
            task.paperID = paperID;
            task.qID = qID;
            task.studentID = studentID;
            task.createdBy = req.username;

            task.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Added to my task. 📝",
                        data: task,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

    async getTaskQuestion(req, res) {
        try {
            const task = await db.TaskQuestion.find({ studentID: req.userId }).populate('testSeriesID').populate('paperID').populate('qID');
            let outputList = [];
            if(task){
                task.map(val=>{
                    if(val.qID){
                        outputList.push(val)
                    }
                })
            }
            return res
                .status(200)
                .json({ status: true, message: `Task list`, data: outputList });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }




    async deleteTaskQuestion(req, res) {
        var _id = req.params.id;


        try {
            var task = await db.TaskQuestion.findOne({ _id });

            task.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Task Removed",
                        data: task,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

}

module.exports = TaskQuestionController;