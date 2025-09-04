import fs from "fs";
import path from "path";

const buildDir = path.resolve("build/client");
const indexFile = path.join(buildDir, "index.html");
const notFoundFile = path.join(buildDir, "404.html");

if (fs.existsSync(indexFile)) {
  fs.copyFileSync(indexFile, notFoundFile);
  console.log("✅ 404.html created in build/client");
} else {
  console.error("❌ index.html not found in", buildDir);
}
