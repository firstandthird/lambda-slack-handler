/* eslint-disable quote-props,quotes */
const slack = require('./index');

const testNotice = function() {
  const payload = {
    "messageType": "DATA_MESSAGE",
    "owner": "488791064862",
    "logGroup": "/aws/lambda/MacroTestStaging-GetIndex-CVNDL3UC91ZY",
    "logStream": "2019/09/18/[$LATEST]6fe172b8612d4dabb533236b7604ce9f",
    "subscriptionFilters": [
      "MacroTestStaging-GetIndexSubscriptionFilter-XB706MM4T62R"
    ],
    "logEvents": [
      {
        "id": "34984627445469672468335919126878763445326437593216253952",
        "timestamp": 1568764950858,
        "message": "2019-09-18T00:02:30.858Z\tbc0fd942-dd9e-4a26-b1c2-5f8ac729f2fe\tINFO\t{\"level\":\"INFO\",\"tags\":{\"notice\":true},\"message\":{\"message\":\"some message\",\"data\":\"data\"}}\n"
      }
    ]
  };
  return slack.handler(payload);
};

const testError = function() {
  const payload = {
    "messageType": "DATA_MESSAGE",
    "owner": "488791064862",
    "logGroup": "/aws/lambda/MacroTestStaging-GetIndex-CVNDL3UC91ZY",
    "logStream": "2019/09/18/[$LATEST]6fe172b8612d4dabb533236b7604ce9f",
    "subscriptionFilters": [
      "MacroTestStaging-GetIndexSubscriptionFilter-XB706MM4T62R"
    ],
    "logEvents": [
      {
        "id": "34984625603807231738081468129573276318344933477776162817",
        "timestamp": 1568764868275,
        "message": "2019-09-18T00:01:08.275Z\t2e91e9cd-412d-4410-a02b-a1aad49b4932\tINFO\t{\"level\":\"ERROR\",\"tags\":{\"error\":true},\"message\":{\"message\":\"some error\",\"data\":\"data\"}}\n"
      }
    ]
  };
  return slack.handler(payload);
};

const testTimeout = function() {
  const payload = {
    "messageType": "DATA_MESSAGE",
    "owner": "488791064862",
    "logGroup": "/aws/lambda/MacroTestStaging-GetIndex-CVNDL3UC91ZY",
    "logStream": "2019/09/18/[$LATEST]6fe172b8612d4dabb533236b7604ce9f",
    "subscriptionFilters": [
      "MacroTestStaging-GetIndexSubscriptionFilter-XB706MM4T62R"
    ],
    "logEvents": [
      {
        "id": "34984627795234560162090212479493949047881338152976580610",
        "timestamp": 1568764966542,
        "message": "2019-09-18T00:02:46.542Z f2704689-7aa3-4af3-ac88-857c01c4bd45 Task timed out after 5.01 seconds\n\n"
      }
    ]
  };
  return slack.handler(payload);
};

const testInvokeError = function() {
  const payload = {
    "messageType": "DATA_MESSAGE",
    "owner": "488791064862",
    "logGroup": "/aws/lambda/MacroTestStaging-GetIndex-CVNDL3UC91ZY",
    "logStream": "2019/09/18/[$LATEST]6fe172b8612d4dabb533236b7604ce9f",
    "subscriptionFilters": [
      "MacroTestStaging-GetIndexSubscriptionFilter-XB706MM4T62R"
    ],
    "logEvents": [
      {
        "id": "34984627561701156443077526940562927082369697762386182148",
        "timestamp": 1568764956070,
        "message": "2019-09-18T00:02:36.070Z\ta62d1861-711f-41fe-8c85-dbf8b9447e43\tERROR\tInvoke Error\t{\"errorType\":\"Error\",\"errorMessage\":\"this is an error\",\"stack\":[\"Error: this is an error\",\"    at Runtime.http [as handler] (/var/task/index.js:25:11)\",\"    at Runtime.handleOnce (/var/runtime/Runtime.js:66:25)\",\"    at process._tickCallback (internal/process/next_tick.js:68:7)\"]}\n"
      }
    ]
  };
  return slack.handler(payload);
};

const testMultiple = function() {
  const payload = {
    "messageType": "DATA_MESSAGE",
    "owner": "488791064862",
    "logGroup": "/aws/lambda/MacroTestStaging-GetIndex-CVNDL3UC91ZY",
    "logStream": "2019/09/18/[$LATEST]6fe172b8612d4dabb533236b7604ce9f",
    "subscriptionFilters": [
      "MacroTestStaging-GetIndexSubscriptionFilter-XB706MM4T62R"
    ],
    "logEvents": [
      {
        "id": "34984627445469672468335919126878763445326437593216253952",
        "timestamp": 1568764950858,
        "message": "2019-09-18T00:02:30.858Z\tbc0fd942-dd9e-4a26-b1c2-5f8ac729f2fe\tINFO\t{\"level\":\"INFO\",\"tags\":{\"notice\":true},\"message\":{\"message\":\"some message\",\"data\":\"data\"}}\n"
      },
      {
        "id": "34984627561701156443077526940562927082369697762386182148",
        "timestamp": 1568764956070,
        "message": "2019-09-18T00:02:36.070Z\ta62d1861-711f-41fe-8c85-dbf8b9447e43\tERROR\tInvoke Error\t{\"errorType\":\"Error\",\"errorMessage\":\"this is an error\",\"stack\":[\"Error: this is an error\",\"    at Runtime.http [as handler] (/var/task/index.js:25:11)\",\"    at Runtime.handleOnce (/var/runtime/Runtime.js:66:25)\",\"    at process._tickCallback (internal/process/next_tick.js:68:7)\"]}\n"
      }
    ]
  };
  return slack.handler(payload);
};

const run = async function() {
  await testNotice();
  await testError();
  await testTimeout();
  await testInvokeError();
  await testMultiple();
};
run();
