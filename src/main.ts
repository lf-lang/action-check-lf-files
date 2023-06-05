import * as core from '@actions/core'
import {configurePath, deleteIfExists, clone, build} from './build'
import {checkAll} from './check'

export async function run(): Promise<void> {
  try {
    const ref: string = core.getInput('compiler_ref')
    const dir: string = core.getInput('checkout_dir')
    const del = !!core.getInput('delete_if_exists')
    const skip = !!core.getInput('skip_clone')

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
    await build(dir)

    configurePath(dir)
    //core.info(`PATH: ${process.env.PATH}`)

    core.info('Checking all Lingua Franca files:')
    if ((await checkAll('.')) === false) {
      core.setFailed('One or more tests failed to compile')
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

if (process.env['NODE_ENV'] != 'test') run()
