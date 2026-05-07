const express = require("express");
const router = express.Router();

const { register, login, logout } = require("../controllers/authControllers");
const authMiddleware = require("../middleware/authMiddleware");
const validateLogin = require("../middleware/validateLogin");

router.post("/login", validateLogin, login);
router.post("/register", register);
router.post("/logout", logout);


// 🔐 ROUTE PROTETTA
router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Accesso consentito",
        user: req.user
    });
});

module.exports = router;