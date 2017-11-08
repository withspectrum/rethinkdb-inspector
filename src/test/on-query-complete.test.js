// @flow
import inspect from '../';
import rethinkdbdash from 'rethinkdbdash';

it('should return timing information', async () => {
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
  expect(onQueryComplete.mock.calls[0][1].time).toBeGreaterThan(0);
});

it('should return size information', async () => {
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
  expect(onQueryComplete.mock.calls[0][1].size).toEqual(2);
});

it('should return size information for objects', async () => {
  const r = rethinkdbdash({
    pool: false,
  });
  const run = jest.fn(() => Promise.resolve({ test: true }));
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
  expect(onQueryComplete.mock.calls[0][1].size).toEqual(12);
});
