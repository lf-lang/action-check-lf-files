import * as core from '@actions/core'
import {simpleGit} from 'simple-git'

async function run(): Promise<void> {
  try {
    const ref: string = core.getInput('compiler-ref')
    const dir: string = core.getInput('checkout-dir')
    const git = simpleGit()
    git.clone('git@github.com:lf-lang/lingua-franca.git', dir)
    git.checkoutLocalBranch(ref) // FIXME: how to point it to the right directory?

    // Build compiler and set command
    
    // Traverse tree


    // core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    // core.debug(new Date().toTimeString())
    // await wait(parseInt(ms, 10))
    // core.debug(new Date().toTimeString())

    // core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
