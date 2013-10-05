var os = Npm.require('os');
var metrics = Meteor.require('librato-metrics');
var metricsClient = metrics.createClient({
  email: process.env.LIBRATO_EMAIL,
  token: process.env.LIBRATO_TOKEN
});

setInterval(sendUsage, 1000);

function sendUsage() {
  metricsClient.post('/metrics', {
    gauges: [
      {name: 'loadavg', value: os.loadavg()[0]},
      {name: 'mem', value: os.totalmem() - os.freemem()},
      {name: 'messages', value: messageCount},
      {name: 'groups', value: _.keys(groupStat).length}
    ],
    source: os.hostname()
  }, function(err, response) {
    if(err) {
      console.log('usage sending failed!');
    }
  });
  messageCount = 0;
}