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

var Defer = function() {
  this.promise = null;

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
