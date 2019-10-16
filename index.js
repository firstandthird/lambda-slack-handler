const Wreck = require('@hapi/wreck');
const zlib = require('zlib');
const pMap = require('p-map');

const slackPayload = function(obj) {
  const payload = {
    attachments: []
  };
  const blocks = [];

  if (typeof obj.data === 'string') {
    blocks.push({
      type: 'section',
      text: {
        type: 'plain_text',
        text: obj.data
      }
    });
  } else {
    if (obj.data.level) {
      obj.level = obj.data.level;
      delete obj.data.level;
    }
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `\`\`\` ${JSON.stringify(obj.data, null, '  ')} \`\`\``
      }
    });
  }
  delete obj.data;

  let color = '';
  let emoji = '';
  if (obj.level === 'INFO') {
    color = '#d1ecf1';
    emoji = ':eyes:';
  }
  if (obj.level === 'WARN') {
    color = '#fff3cd';
    emoji = ':warning:';
  }
  if (obj.level === 'ERROR') {
    color = '#f8d7da';
    emoji = ':fire:';
  }
  if (obj.group) {
    payload.text = `*${emoji} ${obj.level}* - ${obj.group}`;
  }
  delete obj.level;

  const context = [];
  if (obj.date) {
    context.push({
      type: 'plain_text',
      text: obj.date
    });
  }
  if (obj.requestId) {
    context.push({
      type: 'plain_text',
      text: `RequestID: ${obj.requestId}`
    });
  }
  if (context.length !== 0) {
    blocks.push({
      type: 'context',
      elements: context
    });
  }
  // set any special channel:
  payload.attachments = [
    { blocks, color },
  ];
  return payload;
};

const postToSlack = async function(data) {
  await Wreck.post(process.env.SLACK_HOOK, {
    headers: { 'Content-type': 'application/json' },
    payload: JSON.stringify(data)
  });
};

exports.handler = async function(req) {
  const debug = process.env.SLACK_DEBUG === 'on';

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
      const obj = {
        group
      };
      if (e.message.indexOf('\t') !== -1) {
        const [date, requestId, level, data] = e.message.split('\t');
        obj.date = date;
        obj.requestId = requestId;
        obj.level = level;

        if (data && data.startsWith('{')) {
          obj.data = JSON.parse(data);
        } else {
          obj.data = data;
        }
      } else {
        if (e.message.indexOf('Task timed out after') !== -1) {
          obj.level = 'ERROR';
        } else {
          obj.level = 'INFO';
        }
        obj.data = e.message;
      }

      const payload = slackPayload(obj);
      // if we can't report the log to slack,
      // send another message to slack notifying of the failure:
      try {
        await postToSlack(payload);
      } catch (e) {
        await postToSlack(slackPayload({
          data: {
            message: 'lambda-slack-handler Unable to parse log payload',
            data: payload,
            level: 'ERROR',
            tags: { error: true }
          }
        }));
        console.log(e);
      }
    });
  }

  return {
    body: 'ok'
  };
};
