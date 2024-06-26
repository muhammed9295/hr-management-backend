import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// const corsOptions = {
//   origin: function (origin, callback) {
//     const allowedOrigins = ["https://hr-management-frontend.onrender.com", "https://hr-management-backend-ia4k.onrender.com"]; // Add other domains as needed
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('CORS policy violation'));
//     }
//   },
//   credentials: true, // Reflect the request's credentials mode
// };

app.use(
  cors({
    origin: "https://www.courserapid.com",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// app.use(cors(corsOptions));

// Express Configuration
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());
// Express Configuration

// Route Import
 import userRouter from "./routes/user.route.js"
 import employeesRouter from "./routes/employee.route.js"
// Route Import

// Route declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/employees", employeesRouter)
// Route declaration

export { app };
