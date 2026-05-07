const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Campi mancanti" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email non valida" });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password troppo corta" });
    }

    next();
};

module.exports = validateLogin;