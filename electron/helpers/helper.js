const path = require("path");

function getMimeType(filePath) {
  console.log(" path is ==========", filePath);
  const ext = path.extname(filePath).toLowerCase();
  console.log(" ext is ==========", ext);

  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream"; // fallback
  }
}

module.exports = {
  getMimeType,
};
