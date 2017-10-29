// @flow
const { ReqlRuntimeError } = require('rethinkdbdash/lib/error');

// Use ReqlRuntimeError constructor to get the query as a nicely formatted string
function getQueryString() {
  const error = new ReqlRuntimeError('', this._query, { b: this._frames });
  return error.message.replace(' in:\n', '');
}

module.exports = getQueryString;
