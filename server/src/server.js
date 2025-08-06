import express from "express";
import http from "http";
import cors from "cors"; 

import authRouter from "./mrc/auth/user_router.js"
import taskRouter from "./mrc/tasks/task_router.js"
import customErrorHandler from "./middlewares/customErrorHandler.js";
const app = express(); 
app.get("/", (_, res) => res.send("<h2>Hello World from task mangemant</h2>"));
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 204,
  preflightContinue: false,
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/task" ,taskRouter)
const server = http.createServer(app);
app.use(customErrorHandler)
export default server;
