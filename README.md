# `rethinkdb-inspector`

Inspect RethinkDB queries as they happen.

> Note: This module only works with `rethinkdbdash`, PRs to add support for the main `rethinkdb` driver welcome.

## Usage

First, install `rethinkdb-inspector` from npm:

```JS
npm install --save-dev rethinkdb-inspector
```

Then wrap your `rethinkdbdash` instance with the `inspect` method:

```JS
const r = require('rethinkdbdash')(); // -> This is your rethinkdbdash instance
const inspect = require('rethinkdb-inspector');

if (process.env.NODE_ENV === 'development') {
  inspect(r, {});
}
```

> Note: We do not recommend running this module in production, that's why you should guard the `inspect` call with `process.env` check.

### Listening for new queries

To listen to new queries provide the `onQuery` callback:

```JS
inspect(r, {
  onQuery: (query) => {
    console.log(query);
  }
})
```

This callback gets called with a string that looks like the query you made. So, for example, if you were to run `r.db('main').table('users').get('max').run()` your `onQuery` callback would get passed `"r.db('main').table('users').get('max').run()"`.

## License

Licensed under the MIT License, Copyright ©️ 2017 Space Program Inc. See [LICENSE.md](LICENSE.md) for more information.
