require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));

app.use("/", require("./routes"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
