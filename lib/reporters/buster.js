// http://busterjs.org/

Test.Reporters.extend({
  Buster: new JS.Class({

    /*  Missing events:
        See http://docs.busterjs.org/en/latest/modules/buster-test/runner/

        - context:unsupported
        - test:setUp
        - test:async
        - test:tearDown
        - test:timeout
        - test:deferred
        - uncaughtException
    */

    extend: {
      create: function(options) {
        if (JS.ENV.buster) return new this(options);
      }
    },

    startSuite: function(event) {
      this._contexts = 0;
      this._stack = [];
      buster.emit('suite:start');
    },

    startContext: function(event) {
      if (event.context === null) return;
      this._contexts += 1;
      buster.emit('context:start', {name: event.shortName});
    },

    startTest: function(event) {
      this._testPassed = true;
      buster.emit('test:start', {name: event.shortName});
    },

    addFault: function(event) {
      if (!this._testPassed) return;
      this._testPassed = false;

      if (event.error.type === 'failure') {
        buster.emit('test:failure', {
          name: event.test.shortName,
          error: {message: event.error.message}
        });
      }
      else {
        buster.emit('test:error', {
          name: event.test.shortName,
          error: {
            message: event.error.message,
            stack: event.error.backtrace
          }
        });
      }
    },

    endTest: function(event) {
      if (!this._testPassed) return;
      buster.emit('test:success', {name: event.shortName});
    },

    endContext: function(event) {
      if (event.context === null) return;
      buster.emit('context:end', {name: event.fullName});
    },

    update: function(event) {},

    endSuite: function(event) {
      buster.emit('suite:end', {
        ok:         event.passed,
        contexts:   this._contexts,
        tests:      event.tests,
        assertions: event.assertions,
        failures:   event.failures,
        errors:     event.errors,
        timeouts:   0                   // <- TODO
      });
    }
  })
});

