const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { // id: id
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordChangedAt: req.body.passwordChangedAt,
            role: req.body.role
        });

        const token = signToken(newUser._id);

        res.status(201).json({
            status: "success",
            token,
            user: newUser
        });

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // ** check if email and password exist **
        if (!email || !password) {
            if (!email || !password) {
                res.status(401).json({
                    status: "fail",
                    message: "Please provide email and password"
                });
            }
        }

        // ** check if user exists and password is correct **
        const user = await User.findOne({ email }).select("+password"); // { email: email }
        if ( !user || !(await user.correctPassword(password, user.password)) ) { // (password from req.body, password form findOne)
            return res.status(401).json({
                status: "fail",
                message: "Incorrect email or password"
            });
        }

        // ** if everything ok, send token to client **
        const token = signToken(user._id);

        res.status(200).json({
            status: "success",
            token
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
}