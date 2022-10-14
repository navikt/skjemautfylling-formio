#!/usr/bin/env node
import fs from "fs";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
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

const isJson = (response) => response.headers.get("content-type").includes("application/json");

(async () => {
  try {
    const response = await fetch(`${byggerUrl}/notifications`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Bygger-Pusher-Secret-Hash": `${hash(pusherSecret)}`,
      },
      body: JSON.stringify({
        type: eventType,
        githubEventMessage,
      }),
    });
    if (response.ok) {
      console.log(`Notified bygger: ${eventType}`);
    } else {
      const body = isJson(response) ? await response.json() : await response.text();
      console.error(`Failed to notify bygger: ${response.status} ${JSON.stringify(body)}`);
      process.exit(1);
    }
  } catch (e) {
    console.error(`Failed to notify bygger: ${e.message}`);
    process.exit(1);
  }
})();
