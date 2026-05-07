require("dotenv").config();

/**** CONST *************************************************************************************************************/
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const app = express();
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/authMiddleware");
const rateLimit = require("express-rate-limit");

/**** LIMITATOR *********************************************************************************************************/
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 10, // massimo 10 tentativi
  message: "Troppi tentativi, riprova più tardi"
});


app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/auth/login", loginLimiter);


/***** DATABASE ********************************************************************************************************/
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connesso"))
    .catch(err => console.log(err));


/***** APP *************************************************************************************************************/
app.get("/", (req, res) => {
  res.json({ message: "Backend attivo" });
});

app.listen(process.env.PORT, () => {
  console.log("Server attivo su porta", process.env.PORT);
});

app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Accesso consentito",
    user: req.user
  });
});
