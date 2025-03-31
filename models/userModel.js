const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A user must have a name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "A user must have an email"],
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    photo: String,
    role: {
        type: String,
        enum: ["user", "editor", "admin"],
        default: "user"
    },
    password: {
        type: String,
        required: [true, "A user must have a password"],
        minlength: 8,
        select: false
    },
    passwordChangedAt: Date
});

// between getting the data and saving it to the database
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    // hash the password with the cost of 12
    this.password = await bcrypt.hash(this.password, 12); // don't block the event loop
    next();
})

userSchema.methods.correctPassword = async function(canidatePassword, userPassword) {
    return await bcrypt.compare(canidatePassword, userPassword)
};

userSchema.methods.changedPasswordAfter = function(JWTTiemstamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parent(this.passwordChangedAt.getTime() / 1000, 10); // base 10 number
        return JWTTiemstamp < changedTimestamp // JWT issued at 100 < chaged at 200
    }

    // fasle means NOT changes
    return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;