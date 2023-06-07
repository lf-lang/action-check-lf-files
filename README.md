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
# Contributing
Developer docs are available [here](CONTRIBUTING.md).