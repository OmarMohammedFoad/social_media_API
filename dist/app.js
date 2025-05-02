"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./utils/database");
const auth_1 = __importDefault(require("./routes/auth"));
const posts_1 = __importDefault(require("./routes/posts"));
const comments_1 = __importDefault(require("./routes/comments"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
(0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
});
app.use((0, cors_1.default)());
// Middleware
app.use(express_1.default.json());
// Routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/auth", auth_1.default);
app.use("/posts", posts_1.default);
app.use("/comments", comments_1.default);
const startServer = async () => {
    try {
        await (0, database_1.connect)();
        app.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
    }
};
startServer();
