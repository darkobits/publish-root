![publish-root](https://user-images.githubusercontent.com/441546/36626664-b601c7a6-18eb-11e8-879e-dd056a364e07.png)

[![NPM Version][npm-img]][npm-url] [![david][david-img]][david-url] [![Code Style][xo-img]][xo-url]

In large/complex packages, it is often handy to utilize the filesystem in addition to exports to organize and namespace things. However, it can be obnoxious to require your consumers to include a path segment like `dist` when importing a module from your package; it bears no semantic meaning and is often required on every import because it's where all of your package's build artifacts live.

This package attempts to address that issue. Tell it what folder your build artifacts are in, and it ensures your tarballs are packed correctly.

## Setup

Install:

```bash
$ npm install @darkobits/publish-root
```

Then, add the following scripts to your project's `package.json`:

```json
"scripts": {
  "prepack": "pr:pre",
  "postpack": "pr:post"
}
```

It is assumed that your build artifacts are located in `dist`. If this is not the case, you may indicate where they are by passing an argument to `pr:pre`:

```json
"scripts": {
  "prepack": "pr:pre foo"
}
```

To do a dry run, you can run `npm pack` (set the `LOG_LEVEL` environment variable to `verbose` for additional logging) and inspect the contents of the tarball it produces:

```bash
$ npm pack
$ tar -tvf your-package-name-1.2.3.tgz
```

You do not need to change anything in `package.json`; relevant fields will be re-written and restored automagically.

---

This approach has the following benefits:

- Works with Lerna (install in each package, not at the root)
- Does not break `npm link`.

## See Also

- [Publishing flat NPM packages for easier import paths & smaller consumer bundle sizes](https://davidwells.io/blog/publishing-flat-npm-packages-for-easier-import-paths-smaller-consumer-bundle-sizes/)
- [How to NPM publish a specific folder but as package root (Stack Overflow)](https://stackoverflow.com/questions/38935176/how-to-npm-publish-specific-folder-but-as-package-root/39946795)
- [[Feature] Allow custom publish subdirectory (Lerna)](https://github.com/lerna/lerna/issues/91)

## &nbsp;
<p align="center">
  <br>
  <img width="22" height="22" src="https://cloud.githubusercontent.com/assets/441546/25318539/db2f4cf2-2845-11e7-8e10-ef97d91cd538.png">
</p>

[npm-img]: https://img.shields.io/npm/v/@darkobits/publish-root.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@darkobits/publish-root

[david-img]: https://img.shields.io/david/darkobits/publish-root.svg?style=flat-square
[david-url]: https://david-dm.org/darkobits/publish-root

[xo-img]: https://img.shields.io/badge/code_style-XO-e271a5.svg?style=flat-square
[xo-url]: https://github.com/sindresorhus/xo
