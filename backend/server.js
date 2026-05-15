require("dotenv").config();

/**** IMPORTS *************************************************************************************************************/
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

/**** APP *************************************************************************************************************/
const app = express();


/**** CORS ***************************************************************************************************************/
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true
}));


/**** MIDDLEWARE BASE ***************************************************************************************************/
app.use(express.json());
app.use(cookieParser());


/**** RATE LIMIT (LOGIN) ***********************************************************************************************/
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Troppi tentativi, riprova più tardi"
});


/**** ROUTES ************************************************************************************************************/
app.use("/auth", authRoutes);


/**** PROFILE PROTETTA **************************************************************************************************/
app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Accesso consentito",
    user: req.user
  });
});


/**** DATABASE ***********************************************************************************************************/
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connesso"))
    .catch(err => console.log(err));


/**** START SERVER ******************************************************************************************************/
app.listen(process.env.PORT, () => {
  console.log("Server attivo su porta", process.env.PORT);
});