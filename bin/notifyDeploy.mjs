#!/usr/bin/env node
import fs from "fs";
import bcrypt from "bcrypt";
import axios from "axios";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "test") {
  dotenv.config();
}

const hash = (password) => bcrypt.hashSync(password, 10);

const getEnv = (key) => {
  const appValue = process.env[key];
  if (!appValue) {
    throw new Error(`Must specify env var ${key}`);
  }
  return appValue;
};

const args = process.argv.slice(2);
const eventType = args[0];
const usageMessage = "Usage: node bin/notifyDeploy.mjs <success|failure>";
if (eventType !== "success" && eventType !== "failure") {
  console.error(usageMessage);
  process.exit(1);
}
const pusherSecret = getEnv("PUSHER_APP_SECRET");
const byggerUrl = getEnv("BYGGER_URL");

const stdinContent = fs.readFileSync(0, "utf-8");
const githubEventMessage = JSON.parse(stdinContent);

(async () => {
  try {
    await axios.post(
      `${byggerUrl}/notifications`,
      {
        type: eventType,
        githubEventMessage,
      },
      {
        headers: {
          "Bygger-Pusher-Secret-Hash": `${hash(pusherSecret)}`,
        },
      }
    );
    console.log(`Notified bygger: ${eventType}`);
  } catch (e) {
    console.error(`Failed to notify bygger: ${e.message}`);
    process.exit(1);
  }
})();
