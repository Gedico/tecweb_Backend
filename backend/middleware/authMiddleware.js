const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // prendo token dai cookie
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Non autenticato" });
        }

        // verifica JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // salvo utente in request
        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({ message: "Token non valido o scaduto" });
    }
};

module.exports = authMiddleware;