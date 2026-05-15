const express = require("express");
const router = express.Router();



/**** CONTROLLERS ******************************************************************/
const {
    register,
    login,
    logout,
    checkAuth
} = require("../controllers/authControllers");


/**** MIDDLEWARE *******************************************************************/
const authMiddleware = require("../middleware/authMiddleware");
const validateLogin = require("../middleware/validateLogin");
const loginLimiter = require("../middleware/loginLimiter");



/**** ROUTES PUBBLICHE *************************************************************/

router.post("/register", register);
router.post("/login", loginLimiter, validateLogin, login);
router.post("/logout", logout);

router.get("/check", checkAuth);


/**** ROUTE PROTETTA ***************************************************************/

router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Accesso consentito",
        user: req.user
    });
});


/**** EXPORT **********************************************************************/
module.exports = router;