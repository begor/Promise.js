'use strict';

var PromiseModule = (function() {

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

  return {
    getDefer: function (promise) {
      return new Defer(promise);
    },
    getPromise: function () {
      return new Promise()
    }
  };
}());


var test = function () {
  var prom = PromiseModule.getPromise();
  var def = PromiseModule.getDefer(prom);

  setTimeout(function() {
    def.resolve("huh");
  }, 1000);

  return def.promise;
};

test().then(function(msg) { alert(msg)});
