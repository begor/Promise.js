'use strict';

var Promise = function() {
  this.resolveCallbacks = [];
  this.rejectCallbacks = [];

  this.then = function(resolve, reject) {
    this.resolveCallbacks.push(resolve);
    if (reject) {
      this.rejectCallbacks.push(reject);
    }

    return this;
  };
};

var Defer = function(promise) {
  this.promise = promise;

  this.resolve = function(data) {
    this.promise.resolveCallbacks.forEach(function(callback) {
      window.setTimeout(function() {
        callback(data);
      }, 0);
    });
  };

  this.reject = function(error) {
    this.promise.rejectCallbacks.forEach(function(callback) {
      window.setTimeout(function() {
        callback(error);
      }, 0);
    });
  };
};

//Usage example

var test = function () {
  var promise = new Promise();
  var defer = new Defer(promise);

  if (true) {
    window.setTimeout(function() {
      defer.reject(new Error("fuck"));
    }, 0);
  }


  return defer.promise;
}

//chain
test().then(function() { alert ("1")}, function(error) {alert (error.message)}).then(function() {alert ("23")});
