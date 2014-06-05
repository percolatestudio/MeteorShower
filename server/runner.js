// Theoretically this runner should work on both client and server
// but doesn't seem to work on the client due to sock.js problems.
//
// It'd be pretty neat if it did!

var Future = Npm.require('fibers/future');

Meteor.methods({
  runTest: function(url, name, options) {
    var test = Tests[name];
    
    options = options || {};
    
    var result = {
      url: url,
      name: name,
      when: new Date,
      readings: []
    };
    result._id = Results.insert(result);
    
    var start = new Date;
    runTest(result, test);
    console.log('Ran test', name, 'against', url, 'in', (new Date - start) / 1000, 'seconds');
    
    Results.update(result._id, {$set: {done: true}});
  }
});

var runTest = function(result, test) {
  if (_.isFunction(test))
    test = {action: test};
  
  
  var future = new Future;
  var url = result.url;
  
  if (test.before) {
    var beforeServer = DDP.connect(url);
    
    test.before.call(beforeServer);
    beforeServer.disconnect();
  }
  
  // XXX: this is very rough first approximation of what we should do in the end
  var iterations = test.iterations || 10;
  var over = test.over || 60 * 1000; // 1 minute
  
  var done = 0, timeouts = [];
  _.times(iterations, function(i) {
    var wait = i * over / iterations;
    
    // make it parallel
    timeouts.push(Meteor.setTimeout(function() {
      var testServer;
    
    
      if (! test.noConnection)
        var testServer = DDP.connect(url);
    
      test.action.call(null, url);
    
      if (testServer)
        testServer.disconnect();
    
      done += 1;
    
      if (done === iterations)
        future.return();
    }, wait));
  });
  
  // // take readings
  // var interval = Meteor.setInterval(function() {
  //   Results.update(result._id, {$push: {readings: getReading(url)}})
  // }, 1000)
  
  // XXX: options.after
  return future.wait();
}

// for now, we take two readings.
//   1. call a method on the server that checks process cpu usage
//   2. check how long it takes to get the root html file
var getReading = function(url) {
  
  // XXX: how to do these in parallel?
  
  var startedAt = new Date;
  HTTP.get(url)
  var time = new Date - httpStartedAt;
  
  var server = DDP.connect(url);
  // XXX: we should augment DDP to actually be sync
  // var wrapped = Future.wrap(_.bind(server.call, server));
  // return wrapped(pipeline, options || {}).wait();
  
  var load = server.call('meteorshower/load');
  
  return {
    load: load,
    time: time
  };
}