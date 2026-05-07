const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/***** REGISTER ******************************************************************************************************************/
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. crea utente con password criptata
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        res.json({
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/**** LOGIN ******************************************************************************************************************************/
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const error = validateLoginInput(email, password);
        if (error) {
            return res.status(400).json({ message: error });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Credenziali non valide" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Credenziali non valide" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 3600000
        });

        res.json({
            message: "Login effettuato",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                punti: user.punti
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/******** LOGOUT ***********************************************************************************************************/
const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "Strict",
        secure: false // true in produzione HTTPS
    });

    res.json({ message: "Logout effettuato" });
};

/*** FUNZIONI AUSILIARIE ***************************************************************************************************/
const validateLoginInput = (email, password) => {

    if (!email || !password) {
        return "Campi mancanti";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return "Email non valida";
    }
    if (password.length < 6) {
        return "Password troppo corta";
    }

    return null;
};


/******** EXPORTS *******************************************************************************************************/
module.exports = { register, login, logout };
