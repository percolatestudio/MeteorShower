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
  var connections = []
  do {
    runs += 1;
    
    var start = new Date;
    var connection = connect(URL);
    connection.subscribe(test.publication);
    connections.push(connection);
    
    lastRunTime = new Date - start;
    Results.update(result._id, {$push: {timings: lastRunTime}});

    if (runs % LOG_EVERY === 0)
      Log('Connected ' + runs + ' publications, lastRunTime was ' + lastRunTime);
    
    if (! benchmarkRunTime || runs === 10) {
      benchmarkRunTime = lastRunTime;
      console.log('Set benchmarkRunTime to ' + benchmarkRunTime 
        + ' stopping at ' + (benchmarkRunTime * STOP_AT));
    }
      
  } while (lastRunTime < STOP_AT * benchmarkRunTime);
  
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