<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Summary

This GitHub action recursively visits a given `search_dir`, finds every `.lf` file, and reports each file that failed to compile.

# Usage

```
- uses: lf-lang/action-check-lf-files@main
  with:
    checkout_dir: 'lingua-franca'                   # Where the lingua-franca repo should be
    compiler_ref: 'master'                          # Which version of the compiler to use
    delete_if_exists: false                         # Delete if `checkout_dir` already exists
    exclude_dirs: '["failing", "experimental"]'     # JSON array of directories not to visit
    no_compile_flag: false                          # Run lfc with `--no-compile` flag if true
    skip_clone: false                               # Use an existing clone of `lingua-franca`
    search_dir: '.'                                 # Where to start looking for `.lf` files
```

# Building and testing

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests 
```bash
$ npm test
...
```

## Publishing to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder. 

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: GitHub recommends using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

The action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
