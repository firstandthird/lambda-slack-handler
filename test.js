const slack = require('./index');

const testNotice = function() {
  const payload = {
    messageType: 'DATA_MESSAGE',
    owner: '488791064862',
    logGroup: '/aws/lambda/MacroTestStaging-GetIndex-CVNDL3UC91ZY',
    logStream: '2019/09/09/[$LATEST]566a38fddef647e5a9d73d1c37af747a',
    subscriptionFilters: ['MacroTestStaging-GetIndexSubscriptionFilter-1C75TRVQUMEP7'],
    logEvents: [
      { id: '34968828754892774558024942126122602902491961049448120321',
        timestamp: 1568056513071,
        message: '2019-09-09T19:15:13.070Z\te0efdb79-eb84-4037-8919-c505d6261806\tINFO\t{"timestamp":"2019-09-09T19:15:13.070Z","tags":["notice"],"message":{"message":"some message","data":"data"}}\n' }
    ]
  };
  slack.handler(payload);
};

const testError = function() {
  const payload = {
    messageType: 'DATA_MESSAGE',
    owner: '488791064862',
    logGroup: '/aws/lambda/MacroTestStaging-GetIndex-CVNDL3UC91ZY',
    logStream: '2019/09/09/[$LATEST]566a38fddef647e5a9d73d1c37af747a',
    subscriptionFilters: ['MacroTestStaging-GetIndexSubscriptionFilter-1C75TRVQUMEP7'],
    logEvents: [
      { id: '34968828754892774558024942126122602902491961049448120321',
        timestamp: 1568056513071,
        message: '2019-09-09T19:15:13.070Z\te0efdb79-eb84-4037-8919-c505d6261806\tINFO\t{"timestamp":"2019-09-09T19:15:13.070Z","tags":["notice"],"message":{"message":"some message","data":"data"}}\n' }
    ]
  };
  slack.handler(payload);
};

testNotice();
//testError();
