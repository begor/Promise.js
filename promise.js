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
        callback(data)
    });
  };

  this.reject = function(error) {
    this.promise.rejectCallbacks.forEach(function(callback) {
        callback(error)
    });
  };
};


var test = function () {
  var prom = new Promise();
  var def = new Defer(prom);

  setTimeout(function() {
    def.resolve("huh");
  }, 1000);

  return def.promise;
}
