import {deleteIfExists, clone, build} from '../src/build'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import {run} from '../src/main'

const quick = false // change to true for quicker testing

// if (!quick) {
//     test('checkout repo', async () => {
//         await deleteIfExists('foo')
//         await expect(clone('master', 'foo'))
//         await expect(clone('master', 'foo')).rejects.toThrow("fatal: destination path 'foo' already exists and is not an empty directory.")
//         await deleteIfExists('foo')
//     })
// }

// shows how the runner will run a javascript action with env / stdout protocol
test('run directly', async () => {
  process.env['INPUT_CHECKOUT_DIR'] = 'gh-action-test-0'
  process.env['INPUT_COMPILER_REF'] = 'master'
  process.env['INPUT_DELETE_IF_EXISTS'] = 'true'
  process.env['INPUT_SKIP_CLONE'] = String(quick)
  process.env['INPUT_IGNORE_FAILING'] = 'false'

  await run()
}, 60000)

test('run as child process', () => {
    process.env['INPUT_CHECKOUT_DIR'] = 'gh-action-test-1'
    process.env['INPUT_COMPILER_REF'] = 'master'
    process.env['INPUT_DELETE_IF_EXISTS'] = 'true'
    process.env['INPUT_SKIP_CLONE'] = String(quick)
    process.env['INPUT_IGNORE_FAILING'] = 'true'
    process.env['GH_ACTIONS'] = 'true'
    const np = process.execPath
    const ip = path.join(__dirname, '..', 'lib', 'main.js')
    const options: cp.ExecFileSyncOptions = {
      env: process.env
    }
    console.log(cp.execFileSync(np, [ip], options).toString())
  })
  