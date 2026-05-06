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

        res.json(savedUser);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/**** LOGIN ******************************************************************************************************************************/
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Utente non trovato" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Password errata" });
        }

        // 🔐 CREAZIONE TOKEN
        const token = jwt.sign(
            { id: user._id },
            "segreto_super_sicuro",
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login effettuato",
            token: token,
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
    res.json({ message: "Logout effettuato" });
};


/******** EXPORTS *******************************************************************************************************/
module.exports = { register, login, logout };
