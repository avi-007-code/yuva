const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

const { connectDB } = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");
const { responseFormatter } = require("./middleware/responseFormatter");
const { startEventStatusJob } = require("./services/eventStatusJob");

// Connect to MongoDB Database via Prisma
connectDB();
startEventStatusJob();

// Routers
const authRouter = require("./routes/authRoutes");
const adminRouter = require("./routes/adminRoutes");
const mediaRouter = require("./routes/mediaRoutes");
const inviteRouter = require("./routes/inviteRoutes");
const clubRouter = require("./routes/clubRoutes");
const managerRouter = require("./routes/managerRoutes");
const publicRouter = require("./routes/publicRoutes");

// Standard Express Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(responseFormatter);

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map(s => s.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Base route
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Club Event Manager API is running..." });
});

// API Routes
app.use("/auth", authRouter);
app.use("/api/auth", authRouter); // Alias for flexibility

app.use("/admin", mediaRouter);
app.use("/api/admin", mediaRouter); // Alias for flexibility
app.use("/admin", adminRouter);
app.use("/api/admin", adminRouter); // Alias for flexibility

app.use("/invite", inviteRouter);
app.use("/api/invite", inviteRouter); // Alias for flexibility

app.use("/club", clubRouter);
app.use("/api/club", clubRouter); // Alias for flexibility

app.use("/manager", managerRouter);
app.use("/api/manager", managerRouter); // Alias for flexibility

// Public club browsing routes: GET /clubs and GET /clubs/:clubId
app.use("/", publicRouter);

// 404 Handler for unhandled endpoints
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found', errors: {} });
});

// Central Error Handling Middleware (MUST be registered after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Running at http://localhost:${PORT}`);
});
