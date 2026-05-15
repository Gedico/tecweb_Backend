const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");56

/**** REGISTER LOGIC ***********************************************************/
const registerUser = async ({ username, email, password }) => {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Utente già esistente");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    const savedUser = await newUser.save();

    return {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email
    };
};

/**** LOGIN LOGIC *************************************************************/
const loginUser = async (email, password) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Credenziali non valide");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Credenziali non valide");
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return {
        user,
        token
    };
};

/** CHECK **************************************************************************************************************/
const checkAuthService = (token) => {

    if (!token) {
        return { authenticated: false };
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);

        return { authenticated: true };

    } catch (err) {
        return { authenticated: false };
    }
};



module.exports = {
    registerUser,
    loginUser,
    checkAuthService
};