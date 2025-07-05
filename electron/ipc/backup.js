const fs = require("fs-extra");
const path = require("path");
const archiver = require("archiver");
const extract = require("extract-zip");
const { app } = require("electron");
const { logInfo, logError } = require("../helpers/logger");

const userData = app.getPath("userData");
const dbPath = path.join(userData, "database.sqlite");
const uploadsPath = path.join(userData, "uploads");

function createBackup(destination) {
  const tmpPath = destination + ".tmp";

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(tmpPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("error", (err) => reject(err));
    output.on("close", () => {
      fs.renameSync(tmpPath, destination);
      resolve();
    });

    // maybe db name change in the future
    archive.pipe(output);
    archive.file(dbPath, { name: "database.sqlite" });
    archive.directory(uploadsPath, "uploads");

    archive.finalize();
  });
}

async function restoreBackup(zipFilePath) {
  const tempRestorePath = path.join(userData, "temp_restore");

  logInfo("Starting restore process...");
  logInfo("Zip path: " + zipFilePath);
  logInfo("Temp restore path: " + tempRestorePath);

  try {
    await fs.remove(tempRestorePath);
    logInfo("✅ Temp folder cleaned");

    await extract(zipFilePath, { dir: tempRestorePath });
    logInfo("✅ Backup zip extracted");

    const restoredDb = path.join(tempRestorePath, "database.sqlite");
    const restoredUploads = path.join(tempRestorePath, "uploads");

    if (!fs.existsSync(restoredDb) || !fs.existsSync(restoredUploads)) {
      const errMsg = "⚠️ Invalid backup file. Required files not found.";
      logError(errMsg);
      throw new Error(errMsg);
    }

    try {
      await fs.copy(restoredDb, dbPath, { overwrite: true });
      logInfo("✅ Database copied");
    } catch (err) {
      logError("❌ Failed to copy database: " + err.message);
      throw err;
    }

    try {
      // ❌ Remove current uploads folder before copying
      await fs.remove(uploadsPath);
      logInfo("🧹 Old uploads folder removed");

      await fs.copy(restoredUploads, uploadsPath, { overwrite: true });
      logInfo("✅ Uploads folder copied");
    } catch (err) {
      logError("❌ Failed to copy uploads: " + err.message);
      throw err;
    }

    try {
      await fs.chmod(dbPath, 0o600);
      logInfo("✅ DB file permissions set to 600");
    } catch (err) {
      logError("⚠️ Failed to set DB permissions: " + err.message);
      // Not fatal
    }

    await fs.remove(tempRestorePath);
    logInfo("🧹 Temp folder removed");
    logInfo("✅ Restore complete.");
  } catch (err) {
    logError("❌ Restore failed: " + err.message);
    throw err;
  }
}

module.exports = {
  createBackup,
  restoreBackup,
};
