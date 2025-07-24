require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/authRoute");
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoute");
app.use("/api/user", userRoutes);

const courseRoutes = require("./routes/courseRoute");
app.use("/api/course", courseRoutes);

const googleAuthRoute = require("./routes/googleAuthRoute");
app.use("/api/auth", googleAuthRoute);

const swaggerDocs = require("./config/swagger");
swaggerDocs(app);

module.exports = app;
