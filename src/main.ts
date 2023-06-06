import * as core from '@actions/core'
import {configurePath, deleteIfExists, clone, build, gradleStop} from './build'
import {skipDirs, checkAll} from './check'

export async function run(softError = false): Promise<string> {
  let result = 'Success'
  try {
    const ref = core.getInput('compiler_ref')
    const dir = core.getInput('checkout_dir')
    const del = core.getInput('delete_if_exists') === 'true'
    const skip = core.getInput('skip_clone') === 'true'
    const ignore = core.getInput('ignore_failing') === 'true'

    if (skip) {
      core.info(
        `Using existing clone of the Lingua Franca repository in directory '${dir}'`
      )
    } else {
      if (del) {
        await deleteIfExists(dir)
      }
      core.info(
        `Cloning the Lingua Franca repository (${ref}) into directory '${dir}'`
      )
      await clone(ref, dir)
    }

    core.info('Building the Lingua Franca compiler...')
    // await build(dir)

    configurePath(dir)

    core.info('Checking all Lingua Franca files:')
    skipDirs.push(dir)
    if ((await checkAll(dir, '.', ignore)) === false) {
      result = 'One or more tests failed to compile'
      if (!softError) {
        core.setFailed(result)
      }
    }
    await gradleStop(dir)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
  return result
}

// Only execute run() if not in a test environment,
// unless the environment variable GH_ACTIONS was set
// explicitly to signal that we _do_ want to invoke run.
if (process.env['NODE_ENV'] !== 'test' || process.env['GH_ACTIONS'] === 'true')
  run()
