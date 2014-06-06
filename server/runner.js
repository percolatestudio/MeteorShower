// Theoretically this runner should work on both client and server
// but doesn't seem to work on the client due to sock.js problems.
//
// It'd be pretty neat if it did!

var Future = Npm.require('fibers/future');

var DEFAULTS = {
  iterations: 100,
  over: 60 * 1000
}

Meteor.methods({
  runTest: function(id, url, name, options) {
    var test = _.extend(DEFAULTS, Tests[name], options);
      
    var result = {
      _id: id,
      url: url,
      name: name,
      when: new Date,
      readings: []
    };
    result._id = Results.insert(result);
    
    var start = new Date;
    console.log('Running', name, test.iterations, 'times over', test.over/1000, 'seconds against', url);
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
  
  var iterations = test.iterations;
  var over = test.over;
  
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