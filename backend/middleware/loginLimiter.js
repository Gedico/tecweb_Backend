const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuti
    max: 10, // massimo 10 tentativi
    message: {
        message: "Troppi tentativi, riprova più tardi"
    }
});

module.exports = loginLimiter;