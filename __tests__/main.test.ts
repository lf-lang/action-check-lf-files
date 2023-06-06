import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {test} from '@jest/globals'
import {quick} from './debug.test'

// Run the action as a subprocess.
test('exclude failing', () => {
  process.env['INPUT_CHECKOUT_DIR'] = 'gh-action-test-1'
  process.env['INPUT_COMPILER_REF'] = 'master'
  process.env['INPUT_DELETE_IF_EXISTS'] = 'true'
  process.env['INPUT_SKIP_CLONE'] = String(quick)
  process.env['INPUT_EXCLUDE_DIRS'] = '["failing"]'
  process.env['MAIN_DO_RUN'] = 'true'
  process.env['INPUT_SEARCH_DIR'] = '.'
  process.env['INPUT_NO_COMPILE_FLAG'] = 'false'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
