const Question = require("./../models/questionModel");

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();

        res.status(200).json({
            staus: "success",
            results: questions.length,
            data: {
                questions
            },
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

exports.getQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        res.status(200).json({
            status: "success",
            message: {
                question
            }
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

exports.getQuestionByKeyword = async (req, res) => {
    try {
        const keyword = req.params.keyword;
        const question = await Question.find({ // this "question" is the collection name
            $or: [
                { question: { $regex: keyword, $options: "i" } }, // this "question" is the key namew
                { answer: { $regex: keyword, $options: "i" } }
            ]
        });

        res.status(200).json({
            status: "success",
            message: {
                question
            }
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

exports.createQuestion = async (req, res) => {
    try {
        const newQuestion = Question.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                question: newQuestion
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
};

exports.updateQuestion = async (req, res) => { // http 200 OK
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: "success",
            data: {
                question
            }
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

exports.deleteQuestion = async (req, res) => { // http 204 No Content
    try {
        await Question.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: "success",
            data: "null"
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};