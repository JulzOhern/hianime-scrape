const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
const router = require("./routes/index");

config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(cors());

app.use("/", router);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

module.exports = app;
