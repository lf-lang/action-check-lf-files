<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Summary
Action for repositories with Lingua Franca code to ensure that the source files work with a particular version of the compiler (the latest release is used by default).
It recursively visits a given `search_dir`, finds every `.lf` file, and reports each file that either fails a `compile` or `format` check, depending on the specified `check_mode` parameter.
This action was initially developed for use in the [Lingua Franca Playground](https://github.com/lf-lang/playground-lingua-franca).

# Usage

```
- uses: lf-lang/action-check-lf-files@main
  with:
    checkout_dir: 'lingua-franca'                   # Where the lingua-franca repo should be
    check_mode: `compile`                           # Do `compile` (default) or `format` check
    compiler_ref: 'master'                          # Which version of the compiler to use
    delete_if_exists: false                         # Delete if `checkout_dir` already exists
    exclude_dirs: '["failing", "experimental"]'     # JSON array of directories not to visit
    no_compile_flag: false                          # Run lfc with `--no-compile` flag if true
    skip_clone: false                               # Use an existing clone of `lingua-franca`
    search_dir: '.'                                 # Where to start looking for `.lf` files
```
# Contributing

For developer docs that describe how to build, test, and publish, have a look [here](CONTRIBUTING.md).
