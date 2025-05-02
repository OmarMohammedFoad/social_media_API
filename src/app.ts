import express from "express";
import cors from "cors";
import { connect } from "./utils/database";
import authRouter from "./routes/auth";
import postRouter from "./routes/posts";
import commentRouter from "./routes/comments";
import path from "path";

const app = express();
const port = 3000;
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

app.use(cors());
// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

const startServer = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();
