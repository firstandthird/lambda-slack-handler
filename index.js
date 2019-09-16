const Post2Slack = require('post2slack');
const zlib = require('zlib');
const pMap = require('p-map');

let post = null;

exports.handler = function(req) {
  if (!post) {
    post = new Post2Slack({
      username: process.env.SLACK_USERNAME || 'LambdaNotify',
      slackHook: process.env.SLACK_HOOK,
      channel: process.env.SLACK_CHANNEL
    });
  }

  const payload = Buffer.from(req.awslogs.data, 'base64');
  const result = zlib.gunzipSync(payload);

  const eventObj = JSON.parse(result.toString('ascii'));
  const group = eventObj.logGroup;
  //console.log('Full Event: ', eventObj);

  if (eventObj.logEvents) {
    await pMap(eventObj.logEvents, async (e) => {
      await post.postFormatted([], { group, message: e.message, timestamp: e.timestamp });
    });
  }

  return {
    body: 'ok'
  }
}

module.exports = function(options = {}) {
  return exports.handler;
}

