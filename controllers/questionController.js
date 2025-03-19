const fs = require("fs");

const data = JSON.parse(fs.readFileSync(`${__dirname}/../test-data.json`));
const questions = data.questions;

exports.getAllQuestions = async (req, res) => {
    try {
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
        const id = Number(req.params.id);
        console.log("getQuestion", id);
        const question = questions.find(el => el.id == id);

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
    const newId = questions[questions.length - 1].id + 1;
    const newQuestion = Object.assign({ id: newId }, req.body);
    data.questions.push(newQuestion);
    console.log(data.questions);

    fs.writeFile(`${__dirname}/../test-data.json`, JSON.stringify(data), err => {
        res.status(201).json({
            status: "success",
            data: {
                question: newQuestion
            }
        });
    });
};

exports.updateQuestion = async (req, res) => { // http 200 OK
    const id = Number(req.params.id);
    console.log("updateQuestion", id);
    const question = questions.find(el => el.id == id);

    if (!question) {
        return res.status(404).json({
            status: "fail",
            message: ("question not found")
        });
    }

    const updates = req.body;
    for (let key in updates) {
        if (question[key] !== undefined) { // question.hasOwnProperty(key)
            question[key] = updates[key]
        }
    }
    console.log(questions)

    res.status(200).json({
        status: "success",
        data: {
            question: question
        }
    });

}; // not yet written into test-data.json

exports.deleteQuestion = async (req, res) => { // http 204 No Content
    const id = Number(req.params.id);
    console.log("deleteQuestion", id);
    const index = questions.findIndex(el => el.id == id);

    if (index === -1) {
        return res.status(404).json({
            status: "fail",
            message: ("question not found")
        });
    }

    questions.splice(index, 1);
    console.log(questions)

    res.status(204).json({
        status: "success",
        message: "question successfully deleted",
        data: null
    });
}; // not yet written into test-data.json

exports.getQuestionByKeyword = async (req, res) => {
    try {
        const keyword = req.params.keyword;
        console.log("getQuestionByKeyword", keyword);
        const question = questions.find(el => el.question == keyword || el.answer == keyword);

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