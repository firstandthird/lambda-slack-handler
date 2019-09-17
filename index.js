const Post2Slack = require('post2slack');
const zlib = require('zlib');
const pMap = require('p-map');

let post = null;

exports.handler = async function(req) {
  if (!post) {
    post = new Post2Slack({
      username: process.env.SLACK_USERNAME || 'LambdaNotify',
      slackHook: process.env.SLACK_HOOK,
      channel: process.env.SLACK_CHANNEL
    });
  }
  const debug = process.env.DEBUG === 'on';

  let event = {};
  if (req.awslogs) {
    const payload = Buffer.from(req.awslogs.data, 'base64');
    const result = zlib.gunzipSync(payload);

    event = JSON.parse(result.toString('ascii'));
  } else {
    event = req; //used when testing
  }
  if (debug) {
    console.log(JSON.stringify(event)); //eslint-disable-line no-console
  }

  const group = event.logGroup;
  if (event.logEvents) {
    await pMap(event.logEvents, async (e) => {
      await post.postFormatted([], { group, message: e.message, timestamp: e.timestamp });
    });
  }

  return {
    body: 'ok'
  };
};

