import {deleteIfExists, clone, build} from '../src/build'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

const quick = false // change to true for quicker testing

if (!quick) {
    test('checkout repo', async () => {
        await deleteIfExists('foo')
        await expect(clone('master', 'foo'))
        await expect(clone('master', 'foo')).rejects.toThrow("fatal: destination path 'foo' already exists and is not an empty directory.")
        await deleteIfExists('foo')
    })    
}

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_CHECKOUT_DIR'] = 'lingua-franca'
  process.env['INPUT_COMPILER_REF'] = 'master'
  process.env['INPUT_DELETE_IF_EXISTS'] = 'true'
  process.env['INPUT_SKIP_CLONE'] = String(quick)
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
