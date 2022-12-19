import express from "express";
import dotenv from "dotenv";
import fileupload from "express-fileupload";
import colors from "colors";
import path from "path";
import cookieParser from "cookie-parser";


// ends here

// import DB
import connectDB from "./config/db";

// Routes
import healthcheck from "./routes/healthcheck";
import auth from "./routes/auth";
import upload from "./routes/upload";

// Load env vars
dotenv.config();

// connect to database
connectDB();

const app = express();
// Body Parser
app.use(express.json());
// Cookie Parser
app.use(cookieParser());

// File upload
app.use(fileupload());
// set static folder
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", healthcheck);
app.use("/", auth);
app.use("/", upload);

const PORT = process.env.PORT;
const server = app.listen(PORT || 5000, () => {
  console.log(
    `Server running in on port ${PORT}`.yellow.bold
  );
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err}`.red)
  // close server and exit process
  server.close(() => {
    process.exit(1);
  });
});