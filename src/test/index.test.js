// @flow
import inspect from '../';
import rethinkdbdash from 'rethinkdbdash';

describe('inspect', () => {
  it('should wrap .run', () => {
    const r = rethinkdbdash({
      pool: false,
    });
    inspect(r, {});
    expect(r._Term.prototype.run.name).toEqual('inspectRun');
  });

  it('should call the onQuery callback when a query is run', async () => {
    const r = rethinkdbdash({
      pool: false,
    });
    const run = jest.fn(() => Promise.resolve('a'));
    r._Term.prototype.run = run;
    const onQuery = jest.fn();
    inspect(r, {
      onQuery,
    });
    await r
      .db('test')
      .table('bla')
      .get('asdf123')
      .run();
    expect(run).toHaveBeenCalledTimes(1);
    expect(onQuery).toHaveBeenCalledTimes(1);
    expect(onQuery.mock.calls[0][0]).toMatchSnapshot();
  });

  it('should call the onQueryComplete callback with timing information', async () => {
    const r = rethinkdbdash({
      pool: false,
    });
    const run = jest.fn(() => Promise.resolve('a'));
    r._Term.prototype.run = run;
    const onQueryComplete = jest.fn();
    inspect(r, {
      onQueryComplete,
    });
    await r
      .db('test')
      .table('bla')
      .get('asdf123')
      .run();
    expect(run).toHaveBeenCalledTimes(1);
    expect(onQueryComplete).toHaveBeenCalledTimes(1);
    expect(onQueryComplete.mock.calls[0][0]).toMatchSnapshot();
    expect(onQueryComplete.mock.calls[0][1]).toBeGreaterThan(0);
  });
});
