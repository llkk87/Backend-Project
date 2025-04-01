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
        console.log("token", token);

        res.status(201).json({
            status: "success",
            token,
            user: newUser
        });

    } catch (err) {
        console.error("Error during signup:", err); // Log the error for debugging
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
        if (!user || !(await user.correctPassword(password, user.password))) { // (password from req.body, password form findOne)
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

exports.protect = async (req, res, next) => {
    try {
        // ** getting token and check if it's there **
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                status: "fail",
                message: "You are not logged in. Please log in to get access."
            });
        }

        // ** verification token **
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
        console.log("decoded:", decoded);

        // ** check if user still exists (what if the user has been deleted at the same time?) **
        const freshUser = await User.findById(decoded.id);
        console.log("freshUser", freshUser);
        if (!freshUser) {
            return res.status(401).json({
                status: "fail",
                message: "The user beloning to this token does no longer exist."
            }); 
        }

        // ** check if user changed password after token was issued **
        if (freshUser.changedPasswordAfter(decoded.iat)) { // iat for issued at
            return res.status(401).json({
                status: "fail",
                message: "User recently changed password! Please login again."
            });
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = freshUser;
        next();

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        }); 
    }
}

exports.restrictTo = (...roles) => { // authController.restrictTo("admin", "editor") --> roles ["admin", "editor"]
    console.log(...roles)
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) { // ["admin", "editor"].includes("editor")
            return res.status(403).json({
                status: "fail",
                message: "You do not have permission to perform this action"
            });
        }

        next();
    }
}