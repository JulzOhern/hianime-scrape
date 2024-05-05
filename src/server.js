import express from "express";
import cors from "cors";
import { config } from "dotenv";
import router from "./routes/index.js";

config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(cors());

app.use("/", router);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
