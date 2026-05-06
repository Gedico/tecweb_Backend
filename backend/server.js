const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connesso"))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.json({ message: "Backend attivo" });
});

app.listen(process.env.PORT, () => {
  console.log("Server attivo su porta", process.env.PORT);
});