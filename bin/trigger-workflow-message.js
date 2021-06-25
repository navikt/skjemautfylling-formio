#!/usr/bin/env node

import Pusher from 'pusher';
import fs from 'fs';

function isPublication(message) {
  const thisCommit = message.head_commit;
  const commitMessage = thisCommit.message;
  const publishCommitRe = /^\[publisering\].*/;
  const publishMessageResult = commitMessage.match(publishCommitRe);
  return publishMessageResult;
}

function buildTriggerMessage(message) {
  const thisCommit = message.head_commit;
  const pusherMessage = {
    'skjemautfyllerCommit': thisCommit,
    'skjemapublisering': {
      'commitUrl': thisCommit.url
    }
  };
  return pusherMessage;
}

function buildPublishAbortedMessage(message) {
  console.log('github event message', message);
  // TODO rydd opp og få kontroll på meldingsformatet for de ulike event'ene
  const pusherMessage = {
    skjemapublisering: {
      commitUrl: message.inputs.formJsonFileTitle
    },
    monorepoGitHash: message.inputs.monorepoGitHash,
    formJsonFileTitle: message.inputs.formJsonFileTitle
  };
  return pusherMessage;
}


function pusherAppValue(name) {
  const key = `PUSHER_APP_${name.toUpperCase()}`;
  const appValue = process.env[key];
  if (!appValue) {
    throw new Error(`Must specify env var ${key}`);
  }
  return appValue
}

async function sendMessage(pusher, channel, event, pusherMessage) {
  console.log('sending:', channel, event, pusherMessage);
  pusher.trigger(channel, event, pusherMessage);
}

function run(channel, eventMessage, pusherApp) {
  const pusher = new Pusher({
    ...pusherApp,
    useTLS: true
  });
  const pusherMessage = buildTriggerMessage(eventMessage);
  const event = isPublication(eventMessage) ? 'publication' : 'other';
  sendMessage(pusher, channel, event, pusherMessage);
}


const args = process.argv.slice(2);
const channel = args[0];

const usageMessage = "Usage: trigger-workflow-message.mjs <channel>";
if (!channel) {
  throw new Error(usageMessage);
}
const stdinContent = fs.readFileSync(0, 'utf-8');
const githubEventMessage = JSON.parse(stdinContent);

const pusherApp = {
  appId: pusherAppValue('id'),
  key: pusherAppValue('key'),
  secret: pusherAppValue('secret'),
  cluster: pusherAppValue('cluster')
}

if (channel === "publish-aborted") {
  const pusher = new Pusher({
    ...pusherApp,
    useTLS: true
  });
  const pusherMessage = buildPublishAbortedMessage(githubEventMessage);
  const event = "failure";
  sendMessage(pusher, channel, event, pusherMessage);
} else {
  run(channel, githubEventMessage, pusherApp);
}
