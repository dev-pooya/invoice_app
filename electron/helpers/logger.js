const fs = require("fs");
const path = require("path");
const { app } = require("electron");

// Get user data directory
const userData = app.getPath("userData");

// 🔧 Dynamically generate log file path based on year
function getLogFilePath(type = "info") {
  const now = new Date();
  const year = now.getFullYear();

  const fileName = type === "error" ? `error_${year}.txt` : `log_${year}.txt`;

  return path.join(userData, fileName);
}

// 🔧 Write a message to the log file
function writeLog(filePath, message) {
  const entry = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(filePath, entry);
}

// ✅ Log info messages to yearly log
function logInfo(message) {
  const logFile = getLogFilePath("info");
  writeLog(logFile, "ℹ️ " + message);
}

// ❌ Log error messages to yearly error log
function logError(message) {
  const errorFile = getLogFilePath("error");
  writeLog(errorFile, "❌ " + message);
}

// 🧹 Trim a log file if it exceeds a size (default 5 MB)
function trimLogIfTooBig(filePath, maxSize = 5 * 1024 * 1024) {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > maxSize) {
        fs.writeFileSync(filePath, "");
        writeLog(filePath, "🧹 Log trimmed due to size");
      }
    }
  } catch (e) {
    console.error("Failed to trim log file:", filePath, e.message);
  }
}

// 🧹 Trim both info and error logs (called on startup)
function trimAllLogs() {
  trimLogIfTooBig(getLogFilePath("info"));
  trimLogIfTooBig(getLogFilePath("error"));
}

module.exports = {
  logInfo,
  logError,
  trimAllLogs,
  getLogFilePath,
};
