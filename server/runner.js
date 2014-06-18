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
  runTest: function(id, options) {
    this.unblock();
    
    var test = Tests[options.test];
    if (_.isFunction(test))
      test = {action: test};
    
    var environment;
    if (options.environment)
      environment = Environments[options.environment]
    
    options = _.extend({}, DEFAULTS, test, options);
    
    var result = {
      _id: id,
      name: options.name,
      url: options.url,
      environmentName: options.environment,
      testName: options.test,
      when: new Date,
      iterations: options.iterations,
      over: options.over,
      readings: [],
      times: []
    };
    result._id = Results.insert(result);
    
    var start = new Date;
    console.log('Running', result.testName, result.iterations, 'times over', result.over/1000, 'seconds against', result.url, 'with', result.environment);
    runTest(result, environment, test);
    console.log('Ran test', result.testName, 'in', (new Date - start) / 1000, 'seconds');
    
    Results.update(result._id, {$set: {done: true}});
  },

  reset: function() {
    Results.remove({});
  }
});

var runTest = function(result, environment, test) {
  var future = new Future;
  var url = result.url;
  
  // XXX: do we still need this, given environment?
  // if (test.before) {
  //   var beforeServer = DDP.connect(url);
  //   
  //   test.before.call(beforeServer);
  //   beforeServer.disconnect();
  // }
  
  
  // XXX: options for environment
  // XXX: subscribe in parallel?
  var environments = [];
  _.times(100, function(i) {
    var envServer = DDP.connect(url);
    environment.call(envServer);
    environments.push(envServer);
  });
  
  var iterations = result.iterations;
  var over = result.over;
  
  var done = 0, timeouts = [];
  _.times(iterations, function(i) {
    var wait = i * over / iterations;
    
    // make it parallel
    timeouts.push(Meteor.setTimeout(function() {
      var testServer, testStart = new Date;
      
      if (! result.noConnection)
        var testServer = DDP.connect(url);
    
      test.action.call(testServer, url);
    
      if (testServer)
        testServer.disconnect();
      
      Results.update(result._id, {$push: {times: new Date - testStart}});
      
      done += 1;
    
      if (done === iterations)
        future.return();
    }, wait));
  });
  
  // take readings
  // var interval = Meteor.setInterval(function() {
  //   Results.update(result._id, {$push: {readings: getReading(url)}})
  // }, 1000)
  
  future.wait();
  
  // XXX: options.after?
  
  _.each(environments, function(envServer) {
    envServer.disconnect();
  });
}

// for now, we take two readings.
//   1. call a method on the server that checks process cpu usage
//   2. check how long it takes to get the root html file
var getReading = function(url) {
  
  // XXX: how to do these in parallel?
  
  // var startedAt = new Date;
  // HTTP.get(url)
  // var time = new Date - httpStartedAt;
  var time = 0;
  
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