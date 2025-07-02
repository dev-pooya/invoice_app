const fs = require("fs-extra");
const path = require("path");
const archiver = require("archiver");
const extract = require("extract-zip");
const { app } = require("electron");

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

  // Clean temp folder
  await fs.remove(tempRestorePath);

  // Extract to temp
  await extract(zipFilePath, { dir: tempRestorePath });

  const restoredDb = path.join(tempRestorePath, "database.sqlite");
  const restoredUploads = path.join(tempRestorePath, "uploads");

  // Validation check
  if (!fs.existsSync(restoredDb) || !fs.existsSync(restoredUploads)) {
    throw new Error("⚠️ Invalid backup file. Required files not found.");
  }

  // Restore directly without backup
  await fs.copy(restoredDb, dbPath, { overwrite: true });
  await fs.copy(restoredUploads, uploadsPath, { overwrite: true });
  // 🛠️ FIX: ensure writable
  await fs.chmod(dbPath, 0o600);

  // Clean temp folder
  await fs.remove(tempRestorePath);
}

module.exports = {
  createBackup,
  restoreBackup,
};
