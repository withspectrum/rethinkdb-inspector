# `rethinkdb-inspector`

Inspect your RethinkDB queries and find out how fast they are.

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

### Options

#### onQuery: Keep track of your queries

To listen to new queries provide the `onQuery` callback:

```JS
inspect(r, {
  onQuery: (query) => {
    console.log(query);
  }
})
```

This callback gets called with a string that looks like the query you made. So, for example, if you were to run `r.db('main').table('users').get('max').run()` your `onQuery` callback would get passed `"r.db('main').table('users').get('max').run()"`.

#### onQueryComplete: Get query performance information

To listen to completed queries provide the `onQueryComplete` callback:

```JS
inspect(r, {
  onQueryComplete: (query, time) => {
    console.log(query, time);
  }
})
```

This callback gets the same string of the query that `onQuery` gets, but also gets the time it took for the query to complete. This can be very useful for performance optimizations.

> Note: The time it takes for a query to complete is very dependent on the system you're running on. Take the generated times with a grain of salt and only compare them between each other, never between different machines or runs.

### Patterns

#### List all queries in descending order by time

```JS
const fs = require('fs');
const queries = [];

inspect(r, {
  onQueryComplete: (query, time) => {
    // Add the query to the list
    queries.push({ query, time  });
    // Write a file, queries.js, with the list of queries in descending order
    fs.writeFileSync(
      'queries.js',
      JSON.stringify(queries.sort((a, b) => b.time - a.time), null, 2)
    );
  },
});
```

Then open `queries.js` in whatever editor of your choosing to see the list of run queries in descending order by time.

#### Filter changefeed queries (or any other query)

```JS
inspect(r, {
  onQuery: (query) => {
    // Filter all changefeed queries
    if (query.indexOf('.changes') > -1) return;

    // do something here with all normal queries
  }
});
```

This can be used to filter any queries you don't care about. Only want queries running on the "users" table? `if (query.indexOf('users') === -1) return;`

#### More

Got a cool pattern you used with `rethinkdb-inspector`? Submit a PR and add it to this section!

## License

Licensed under the MIT License, Copyright ©️ 2017 Space Program Inc. See [LICENSE.md](LICENSE.md) for more information.
