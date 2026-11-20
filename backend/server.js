import dotenv from "dotenv"
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import swipeRoutes from "./routes/swipeRoutes.js";
import { attachDemoUser } from "./attchDemoUser.js";

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config({
  path:".env"
})

//instialize socket.io server
app.use(
  cors({
    origin: ["http://localhost:5175", "https://chat-ease-client.vercel.app"],
    credentials: true,
  }),
);

const port = process.env.PORT || 5000;

app.use("/api", attachDemoUser, swipeRoutes);

// Connect to MongoDB
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};
startServer();

