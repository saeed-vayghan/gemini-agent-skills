import { App } from '@slack/bolt';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Event handler with proper error handling
app.event('app_mention', async ({ event, say, logger }) => {
  try {
    await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Hello <@${event.user}>!`,
          },
        },
      ],
      thread_ts: event.ts,
    });
  } catch (error) {
    logger.error('Error handling app_mention:', error);
  }
});