# Contributing

## Code conventions, code style

Yea is written as pure JavaScript with no precompilation (other than minification for the distributed version).

## Documentation

Documentation of all methods should be kept up-to-date in two places:

- `README.md` – Extensive documentation for each method, with examples
- `index.d.ts` – 1-to-2 sentence documentation for each method, with minimal examples

## Changelog

Each change should be complemented with a bulletpoint in CHANGELOG.md under "Upcoming".

## Release process

Make sure to build latest sources (open issue #16):

```shell
$ yarn build
```

Bump up the version:

```shell
$ yarn version
info Current version: 1.3.0
question New version:
```

Publish on npm:

```shell
yarn publish
```

Remember to update:

- CHANGELOG.md
- Version in README: `https://cdn.jsdelivr.net/npm/yea@X.X.X/build/yea.min.js`
