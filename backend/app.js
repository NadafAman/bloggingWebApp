import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import blogRouter from "./routes/blogRouter.js";
import fileUpload from "express-fileupload";
import path from "path";
const app = express();
dotenv.config({ path: "./config.env" });
const _dirname = path.resolve();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);

app.use(express.static(path.join(_dirname,"/frontend/dist")))
app.get('*',(_,res)=>{
  res.sendFile(path.resolve(_dirname,"/frontend","dist","index.html"))
});

dbConnection();

app.use(errorMiddleware);

export default app;
