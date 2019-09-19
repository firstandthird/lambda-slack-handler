const Wreck = require('@hapi/wreck');
const zlib = require('zlib');
const pMap = require('p-map');

const slackPayload = function(obj) {
  const attachment = {
    fields: []
  };
  if (typeof obj.data === 'string') {
    attachment.title = obj.data;
  } else {
    attachment.text = `\`\`\` ${JSON.stringify(obj.data, null, '  ')} \`\`\``;
  }
  delete obj.data;
  if (obj.level === 'INFO') {
    attachment.color = 'good';
  }
  if (obj.level === 'WARN') {
    attachment.color = 'warning';
  }
  if (obj.level === 'ERROR') {
    attachment.color = 'danger';
  }
  delete obj.level;
  Object.keys(obj).forEach((key) => {
    attachment.fields.push({
      title: key,
      value: obj[key]
    });
  });
  // set any special channel:
  const payload = {
    attachments: [attachment]
  };
  if (process.env.SLACK_CHANNEL) {
    payload.channel = process.env.SLACK_CHANNEL;
  }
  payload.icon_emoji = process.env.SLACK_EMOJI || ':warning:';
  payload.username = process.env.SLACK_USERNAME || 'LambdaNotify';
  return payload;
};

const postToSlack = async function(payload) {
  const { res } = await Wreck.post(process.env.SLACK_HOOK, {
    headers: { 'Content-type': 'application/json' },
    payload: JSON.stringify(payload)
  });
  if (res.statusCode !== 200) {
    throw new Error(`post to failed: ${res.statusCode} ${res.statusMessage}`);
  }
};

exports.handler = async function(req) {
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
        obj.level = 'INFO';
        obj.data = e.message;
      }

      //console.log(JSON.stringify(obj, null, 2));
      const payload = slackPayload(obj);
      //console.log(JSON.stringify(payload, null, 2));
      await postToSlack(payload);
    });
  }

  return {
    body: 'ok'
  };
};

