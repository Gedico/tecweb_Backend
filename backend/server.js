const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "QuickSketch backend attivo 🚀" });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`);
});