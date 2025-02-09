import express from "express";
import mongoose from "mongoose";
import router from "./routes/blogpostRoutes.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const port = 4000;
const mongo_uri = process.env.MONGO_URL;

mongoose
  .connect(mongo_uri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("error", err));

app.use(express.json());

app.use("/api/blogs", router);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
