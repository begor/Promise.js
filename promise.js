'use strict';

/**
 * Promise module.
 * Holds all the functionality: States object, Promise constructor and prototype.
 * Returns public method getPromise which returns Promise object.
 * @type {{getPromise}}
 */
var PromiseModule = (function () {

	/**
	 * Object that represents possible states of a Promise.
	 * @type {{PENDING: number, FULFILLED: number, REJECTED: number}} - States of a Promise.
	 */
	var States = {
		PENDING: 0,
		FULFILLED: 1,
		REJECTED: 2
	};

	/**
	 * @constructor Promise. Creates a Promise object with default (PENDING) state and empty data, callbacks and thens collections.
	 */
	var Promise = function () {
		this.data = null;
		this.state = States.PENDING;
		this.callbacks = {
			fulfill: null,
			reject: null
		};
		this.thenQueue = [];
	};

	/**
	 * Promise prototype.
	 * Default state for every Promise is pending.
	 * @type {{state: number, data: null, thenQueue: null, changeState: Function, then: Function, resolve: Function, fulfill: Function, reject: Function}}
	 */
	Promise.prototype = {
		thenQueue: null,

		/**
		 * Method that transits given Promise to newState with passed data
		 * @param newState
		 * @param data
		 */
		changeState: function (newState, data) {
			this.state = newState;
			this.data = data;

			this.resolve();
		},

		/**
		 * Method for chaining Promises and assigning callbacks to them.
		 * @returns {Promise} - then must return a Promise
		 * @param fulfillCallback - callback that should be applied if Promise resolved to fulfilled state
		 * @param rejectCallback - callback that should be applied if Promise resolved to rejected state
		 */
		then: function (fulfillCallback, rejectCallback) {
			var thenPromise = new Promise();

			thenPromise.callbacks.fulfill = fulfillCallback;
			thenPromise.callbacks.reject = rejectCallback;

			this.thenQueue.push(thenPromise);
			this.resolve();

			return thenPromise;
		},

		/**
		 * Method which returns Promise, that will be resolved after all the Promises in given Collection.
		 * If one of the given Promises is resolved to REJECTED, resulting Promise will also be REJECTED.
		 * @param promiseCollection
		 * @returns {Promise}
		 */
		all: function (promiseCollection) {
			var resultPromise = new Promise();
			var results = [];

			setTimeout(function() {
				while (promiseCollection.length) {
					var currentPromise = promiseCollection.shift();

					if (currentPromise.state === States.REJECTED) {
						results = [currentPromise.data];
						resultPromise.reject(results);
						break;
					}

					results.push(currentPromise.data);
				}
			}, 0);

			if (resultPromise.state === States.PENDING){
				resultPromise.fulfill(results);
			}

			return resultPromise;

		},

		/**
		 * Method that resolves Promises.
		 * Iterate through thenQueue array and applying callbacks for each of them.
		 */
		resolve: function () {
			var self = this,
				fulfillFall = function (value) { return value; },
				rejectFall = function (reason) { return reason; };

			/**
			 * If promise wasn't resolved we can't process further
			 */
			if (this.state === States.PENDING) {
				return;
			}

			setTimeout(function() {
				while (self.thenQueue.length) {
					var then = self.thenQueue.shift(),
						value = null,
						callback = null;

					if (self.state === States.FULFILLED) {
						callback = then.callbacks.fulfill || fulfillFall;
						value = callback(self.data);
						then.fulfill(value);
					} else {
						callback = then.callbacks.reject || rejectFall;
						value = callback(self.data);
						then.reject(value);
					}
				}
			}, 0);

		},

		/**
		 * Simple public method to fulfill a Promise.
		 * All we do here is delegate call to changeState method with respective state and data arg.
		 * @param data - data with which Promise will be fulfilled
		 */
		fulfill: function (data) {
			this.changeState(States.FULFILLED, data);
		},

		/**
		 * Simple public method to reject a Promise.
		 * All we do here is delegate call to changeState method with respective state and data arg.
		 * @param reason
		 */
		reject: function (reason) {
			this.changeState(States.REJECTED, reason);
		}
	};

	return {
		getPromise: function () {
			return new Promise();
		}
	};
}());