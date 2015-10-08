'use strict';

var Promise = function () {
  this.resolveCallbacks = [];
  this.rejectCallbacks = [];
};

Promise.prototype = {
  resolveCallbacks: null,
  rejectCallbacks: null,

  then: function (resolve, reject) {
    this.resolveCallbacks.push(resolve);
    if(reject) {
      this.rejectCallbacks.push(reject);
    }
  }
};

var Defer = function (promise) {
  this.promise = promise;
};

Defer.prototype = {
  promise: null,

  resolve: function (data) {
    this.promise.resolveCallbacks.forEach(function (callback) {
        callback(data)
    });
  },

  reject: function(error) {
    this.promise.rejectCallbacks.forEach(function (callback) {
        callback(error)
    });
  }
};

var test = function () {
  var prom = new Promise();
  var def = new Defer(prom);

  setTimeout(function() {
    def.resolve("huh");
  }, 1000);

  return def.promise;
}

test().then(function (message) { alert(message); }).then(function () { alert("@@@@@SSSS")});
