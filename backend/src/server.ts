import  express  from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import pdfRoutes from "./routes/pdfRoutes";
import statsRoutes from "./routes/statsRoutes";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pdfs", pdfRoutes);
app.use("/api/stats", statsRoutes);
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log("MongoDb conneted"))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("API running");
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
});