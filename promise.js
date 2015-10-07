'use strict';

var Promise = function() {
  this.resolveCallbacks = [];
  this.rejectCallbacks = [];

  this.then = (resolve, reject) => {
    this.resolveCallbacks.push(resolve);
    if (reject) {
      this.rejectCallbacks.push(reject);
    }

    return this;
  };
};

var Defer = function(promise) {
  this.promise = promise;

  this.resolve = data => {
    this.promise.resolveCallbacks.forEach(callback => {
      setTimeout(() => {
        callback(data);
      }, 0);
    });
  };

  this.reject = error => {
    this.promise.rejectCallbacks.forEach(callback => {
      setTimeout(() => {
        callback(error);
      }, 0);
    });
  };
};


var test = function () {
  var prom = new Promise();
  var def = new Defer(prom);

  setTimeout(() => {
    def.resolve("huh");
  }, 1000);

  return def.promise;
}

test()
  .then(
    result => alert("Fulfilled: " + result),
    error => alert("Rejected: " + error.message) // Rejected: время вышло!
  );
