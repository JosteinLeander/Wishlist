const mongoose = require("mongoose");

// Definerer bruker skjema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
