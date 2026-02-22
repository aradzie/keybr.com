#!/usr/bin/env node

import { execSync } from "node:child_process";
import { spawn } from "node:child_process";

// Kill any process using port 3000
try {
  // Try multiple methods to ensure the port is freed
  try {
    execSync("fuser -k 3000/tcp 2>/dev/null", { stdio: "ignore" });
  } catch {
    // fuser not available or no process on port
  }
  try {
    execSync("lsof -ti:3000 | xargs kill -9 2>/dev/null", { stdio: "ignore" });
  } catch {
    // lsof not available or no process on port
  }
  try {
    execSync("pkill -f 'node.*index.js' 2>/dev/null", { stdio: "ignore" });
  } catch {
    // No matching process found
  }
} catch {
  // Ignore all errors during cleanup
}

// Give it a moment to fully release the port
await new Promise((resolve) => setTimeout(resolve, 1500));

// Start the actual server
const proc = spawn("node", ["--enable-source-maps", "./root/index.js"], {
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "development" },
});

proc.on("error", (err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

process.on("SIGTERM", () => proc.kill("SIGTERM"));
process.on("SIGINT", () => proc.kill("SIGINT"));
