'use strict';

var PromiseModule = (function() {

  var Promise = function() {
    this.resolveCallbacks = [];
    this.rejectCallbacks = [];
  };

  Promise.prototype = {
    resolveCallbacks: null,
    rejectCallbacks: null,

    then: function(resolve, reject) {
      this.resolveCallbacks.push(resolve);
      if (reject) {
        this.rejectCallbacks.push(reject);
      }
    },

    resolve: function(data) {
      this.resolveCallbacks.forEach(function(callback) {
        callback(data)
      });
    },

    reject: function(error) {
      this.rejectCallbacks.forEach(function(callback) {
        callback(error)
      });
    }
  };

  return {
    getPromise: function() {
      return new Promise();
    }
  };
}());


var test = function() {
  var prom = PromiseModule.getPromise();

  setTimeout(function() {
    prom.resolve("huh");
  }, 1000);

  return prom;
};

test().then(function(msg) {
  alert(msg)
});
