const fs = require("fs/promises");
const path = require("path");

const CLIENT_DIR = "../client/src/shared/types";
const SERVER_DIR = "../server/src/shared/types";

async function copyDirectoryContents(srcDir, destDir) {
  try {
    // Ensure the destination directory exists
    await fs.mkdir(destDir, { recursive: true });

    // Read all files/directories in the source directory
    const entries = await fs.readdir(srcDir, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name);
      const destPath = path.join(destDir, entry.name);

      if (entry.isFile()) {
        await fs.copyFile(srcPath, destPath);
      } else if (entry.isDirectory()) {
        // Recursively copy subdirectories
        await copyDirectoryContents(srcPath, destPath);
      }
    }

    console.log(`All files copied from ${srcDir} to ${destDir}`);
  } catch (err) {
    console.error("Error copying directory:", err);
  }
}

Promise.all([
  copyDirectoryContents("./types", CLIENT_DIR),
  copyDirectoryContents("./types", SERVER_DIR),
]);
