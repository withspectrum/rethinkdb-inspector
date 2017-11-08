// @flow
const now = require('performance-now');
const sizeof = require('object-sizeof');
const { RethinkDBInspectorError } = require('./error');
const getQueryString = require('./get-query-string');

type RethinkDBDashInstance = Object;

type Callbacks = {
  onQuery?: string => void,
  onQueryComplete?: (string, { time: number, size: number }) => void,
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

  const { onQuery, onQueryComplete } = callbacks;

  // Save the original .run function
  const run = r._Term.prototype.run;

  // Monkeypatch Term.prototype.run
  r._Term.prototype.run = function inspectRun(...args) {
    if (this._query && onQuery) {
      onQuery(getQueryString.call(this));
    }

    let start;

    if (onQueryComplete) {
      start = now();
    }
    // Call the original .run
    return run.call(this, ...args).then(arg => {
      if (onQueryComplete) {
        onQueryComplete(getQueryString.call(this), {
          time: Number((now() - start).toFixed(2)),
          size: sizeof(arg),
        });
      }
      return arg;
    });
  };
};

module.exports = inspect;
