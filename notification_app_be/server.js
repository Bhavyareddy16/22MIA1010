require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Log = require("../logging_middleware/logger");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let notifications = [
  {
    id: 1,
    title: "System check",
    message: "Notification service is ready",
    type: "info",
    read: false,
    createdAt: new Date().toISOString(),
  },
];

app.get("/", async (req, res) => {
  await Log("backend", "info", "route", "Health check endpoint called");
  res.json({ message: "Notification backend is running" });
});

app.get("/notifications", async (req, res) => {
  try {
    await Log("backend", "info", "route", "GET /notifications requested");
    res.json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    await Log("backend", "error", "handler", "Failed to fetch notifications");
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
});

app.post("/notifications", async (req, res) => {
  try {
    const { title, message, type } = req.body;

    if (!title || !message) {
      await Log("backend", "warn", "handler", "Create notification validation failed");
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    const notification = {
      id: Date.now(),
      title,
      message,
      type: type || "info",
      read: false,
      createdAt: new Date().toISOString(),
    };

    notifications.unshift(notification);

    await Log("backend", "info", "service", "Notification created successfully");

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    await Log("backend", "error", "handler", "Failed to create notification");
    res.status(500).json({
      success: false,
      message: "Failed to create notification",
    });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await Log("backend", "info", "route", `Server started on port ${PORT}`);
});