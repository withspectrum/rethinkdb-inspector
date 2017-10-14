// @flow
const { ReqlRuntimeError } = require('rethinkdbdash/lib/error');
const { RethinkDBInspectorError } = require('./error');

type RethinkDBDashInstance = Object;

type Callbacks = {
  onQuery?: string => void,
};

const inspect = (r: RethinkDBDashInstance, callbacks: Callbacks) => {
  if (!r || !r._Term)
    throw new RethinkDBInspectorError(
      'Please provide a RethinkDBDash instance as the first argument to rethinkdb-inspector. See https://github.com/withspectrum/rethinkdb-inspector for more information.'
    );
  if (!callbacks)
    throw new RethinkDBInspectorError(
      'Please provide an object with callbacks as the second argument to rethinkdb-inspector. See https://github.com/withspectrum/rethinkdb-inspector for more information.'
    );

  const { onQuery } = callbacks;

  // Save the original .run function
  const run = r._Term.prototype.run;

  // Monkeypatch Term.prototype.run
  r._Term.prototype.run = function inspectRun(...args) {
    if (this._query && onQuery) {
      // Construct a ReqlRuntimeError to get nice query formatting
      const error = new ReqlRuntimeError('', this._query, { b: this._frames });
      onQuery(error.message.replace(' in:\n', ''));
    }
    // Call the original .run
    return run.call(this, ...args);
  };
};

module.exports = inspect;
