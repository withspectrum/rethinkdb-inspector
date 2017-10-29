// @flow
const { ReqlRuntimeError } = require('rethinkdbdash/lib/error');
const now = require('performance-now');
const { RethinkDBInspectorError } = require('./error');

type RethinkDBDashInstance = Object;

type Callbacks = {
  onQuery?: string => void,
  onQueryComplete?: (string, number) => void,
};

// Use ReqlRuntimeError constructor to get the query as a nicely formatted string
function getQuery() {
  const error = new ReqlRuntimeError('', this._query, { b: this._frames });
  return error.message.replace(' in:\n', '');
}

const inspect = (r: RethinkDBDashInstance, callbacks: Callbacks) => {
  if (!r || !r._Term)
    throw new RethinkDBInspectorError(
      'Please provide a RethinkDBDash instance as the first argument to rethinkdb-inspector. See https://github.com/withspectrum/rethinkdb-inspector for more information.'
    );
  if (!callbacks)
    throw new RethinkDBInspectorError(
      'Please provide an object with callbacks as the second argument to rethinkdb-inspector. See https://github.com/withspectrum/rethinkdb-inspector for more information.'
    );

  const { onQuery, onQueryComplete } = callbacks;

  // Save the original .run function
  const run = r._Term.prototype.run;

  // Monkeypatch Term.prototype.run
  r._Term.prototype.run = function inspectRun(...args) {
    if (this._query && onQuery) {
      onQuery(getQuery.call(this));
    }

    let start;

    if (onQueryComplete) {
      start = now();
    }
    // Call the original .run
    return run.call(this, ...args).then(arg => {
      if (onQueryComplete) {
        onQueryComplete(
          getQuery.call(this),
          Number((now() - start).toFixed(2))
        );
      }
      return arg;
    });
  };
};

module.exports = inspect;
