const express = require("express");
const authRoutes = require("./routes/auth");
const fileRoutes = require("./routes/files");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use(authRoutes);
app.use(fileRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});