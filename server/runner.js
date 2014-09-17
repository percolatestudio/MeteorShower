var STOP_AT = 10; // when time gets to this many times as much
var URL = 'http://' + Meteor.settings.public.testHost + ':' + Meteor.settings.public.testPort;
var LOG_EVERY = 100;

// XXX: should send a PR to core that does this
var Future = Npm.require('fibers/future');
var connect = function(url) {
  var server = DDP.connect(url);

  var oldSubscribe = server.subscribe;
  server.subscribe = function() {
    var future = new Future;

    var newArgs = Array.prototype.slice.call(arguments)
    newArgs.push({
      onReady: _.bind(future.return, future),
      onError: function(error) {
        future.throw(new Error('Subscription Error:' + error.reason))
      }
    });
    oldSubscribe.apply(server, newArgs);

    return future.wait();
  }
  
  return server;
}

var average = function(numbers) {
  return _.reduce(numbers, function(memo, num){ return memo + num; }, 0) / numbers.length;
}

var allGreaterThan = function(numbers, than) {
  return _.every(numbers, function(num){ num > than});
}

var median = function(numbers) {
  if (numbers.length === 0)
    throw new Error('No median');

  return _.sortBy(numbers, _.identity)[Math.floor(numbers.length / 2)];
}

startTestRun = function(result) {
  var test = result.test();
  
  Log('Running' + test.name + '[' + test.publication + ']');
  
  if (test.method) {
    Log('Preparing by calling ' + test.method + ' / start');
    var methodConnection = connect(URL);
    methodConnection.call(test.method, 'start');
    methodConnection.close();
  }
  Log('Prepared, running test.');
  
  var lastRunTime, benchmarkRunTime, runs = 0;
  var lastRunTimes = [];
  var connections = []
  do {
    runs += 1;
    
    var start = new Date;
    var connection = connect(URL);
    connection.subscribe(test.publication);
    connections.push(connection);
    
    lastRunTime = new Date - start;
    Results.update(result._id, {$push: {timings: lastRunTime}});
    lastRunTimes.push(lastRunTime)
    
    // only keep 10
    if (lastRunTimes.length > 10)
      lastRunTimes.shift();

    if (runs % LOG_EVERY === 0)
      Log('Connected ' + runs + ' publications, lastRunTimes were ' + lastRunTimes);
    
    if (! benchmarkRunTime || runs === 10) {
      benchmarkRunTime = median(lastRunTimes);
      console.log('Set benchmarkRunTime to ' + benchmarkRunTime 
        + ' stopping at ' + (benchmarkRunTime * STOP_AT));
    }
      
  } while (! allGreaterThan(lastRunTimes, STOP_AT * benchmarkRunTime));
  
  Results.update(result._id, {$set: {complete: true}});
  Log('Test done, maxed out at ' + runs + ' connections');

  _.each(connections, function(c) { c.close(); });

  if (test.method) {
    Log('Cleaning up by calling ' + test.method + ' / stop');
    var methodConnection = connect(URL);
    methodConnection.call(test.method, 'stop');
    methodConnection.close();
  }
}