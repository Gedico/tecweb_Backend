const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    punti: {
        type: Number,
        default: 0
    },

    stats: {
        sketchesCreati: {
            type: Number,
            default: 0
        },
        paroleIndovinate: {
            type: Number,
            default: 0
        },
        tentativiTotali: {
            type: Number,
            default: 0
        }
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", UserSchema);