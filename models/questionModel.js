const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Q&A must have a question"],
        unique: true
    },
    answer: {
        type: String,
        required: [true, "Q&A must have an answer"]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;