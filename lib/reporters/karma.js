// https://github.com/karma-runner/karma

Test.Reporters.extend({
  Karma: new JS.Class({
    extend: {
      create: function(options) {
        if (JS.ENV.__karma__) return new this(options);
      }
    },

    initialize: function(options) {
      this._karma  = JS.ENV.__karma__;
      this._testId = 0;
    },

    startSuite: function(event) {
      this._karma.info({total: event.size});
    },

    startContext: function(event) {},

    startTest: function(event) {
      this._faults = [];
      this._start  = event.timestamp;
    },

    addFault: function(event) {
      var message = event.error.message;
      if (event.error.backtrace) message += '\n' + event.error.backtrace;
      this._faults.push(message);
    },

    endTest: function(event) {
      this._karma.result({
        id:          ++this._testId,
        description: event.shortName,
        suite:       event.context,
        success:     this._faults.length === 0,
        skipped:     0,
        time:        event.timestamp - this._start,
        log:         this._faults
      });
    },

    endContext: function(event) {},

    update: function(event) {},

    endSuite: function(event) {
      this._karma.complete();
    }
  })
});

