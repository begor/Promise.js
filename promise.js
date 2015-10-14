'use strict';

var PromiseModule = (function () {

	/**
	 * Object that represents possible states of a Promise.
	 * @type {{PENDING: number, FULFILLED: number, REJECTED: number}}
	 */
	var States = {
		PENDING: 0,
		FULFILLED: 1,
		REJECTED: 2
	};

	var Promise = function () {
		this.thenQueue = [];
	};

	/**
	 * Promise prototype.
	 * Default state for every Promise is pending.
	 * @type {{state: number, data: null, thenQueue: null, changeState: Function, then: Function, resolve: Function, fulfill: Function, reject: Function}}
	 */
	Promise.prototype = {
		state: States.PENDING,
		data: null,
		thenQueue: null,

		/**
		 * Method that transits given Promise to newState with passed data
		 * @param newState
		 * @param data
		 */
		changeState: function (newState, data) {
			this.state = newState;
			this.data = data;
		},

		/**
		 * Method for chaining Promises and assigning callbacks to them.
		 * @param resolve - callback that should be applied if Promise resolved to fulfilled state
		 * @param reject - callback that should be applied if Promise resolved to rejected state
		 * @returns {Promise}
		 */
		then: function (resolve, reject) {
			var thenPromise = new Promise();
			var self = this;

			var thenObj = {
				resolveCb: resolve,
				rejectCb: reject ? reject : null,
				promise: thenPromise
			};

			self.thenQueue.push(thenObj);
			self.resolve();


			return thenPromise;
		},

		/**
		 * Method that resolve Promises.
		 * Iterate through thenQueue array and applying callbacks for each of them.
		 */
		resolve: function () {
			var self = this;

			while (self.thenQueue.length) {
				var then = self.thenQueue.shift();
				var value = null;
				if (self.state === States.FULFILLED) {
					value = then.resolveCb(self.data);
					then.promise.changeState(States.FULFILLED, value);
				} else {
					if (then.rejectCb !== null) {
						value = then.rejectCb(self.data);
						then.promise.changeState(States.REJECTED, value);
					}
				}
			}
		},

		/**
		 * Simple public method to fulfill a Promise.
		 * All we do here is changing state of a Promise with given data.
		 * @param data - data with which Promise will be fulfilled
		 */
		fulfill: function (data) {
			this.changeState(States.FULFILLED, data);
		},

		/**
		 *
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


var test = function () {
	var prom = PromiseModule.getPromise();

	prom.fulfill("huh");
	return prom;
};

test().then(function (msg) {
	setTimeout(function () {
		alert(msg)
	}, 1000);
}).then(function () {
	alert("uhuhu")
}, function () {
	alert("no way!")
});