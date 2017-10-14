// @flow
function RethinkDBInspectorError(message: string) {
  this.message = this.msg = `[rethinkdb-inspector] ${message}`;
  Error.captureStackTrace(this, RethinkDBInspectorError);
}

RethinkDBInspectorError.prototype = new Error();
RethinkDBInspectorError.prototype.name = 'RethinkDBInspectorError';

module.exports.RethinkDBInspectorError = RethinkDBInspectorError;
