import * as fs from 'fs'
import * as child_process from 'child_process'
import {promisify} from 'util'
import * as core from '@actions/core'

const readdir = promisify(fs.readdir)
const lstat = promisify(fs.lstat)
const exec = promisify(child_process.exec)

const ignore = [core.getInput('checkout_dir'), 'node_modules'] //, 'failing']

export async function checkAll(dir: string): Promise<boolean> {
  let passed = true

  const files = await readdir(dir)

  for (const fileName of files) {
    const filePath = `${dir}/${fileName}`
    const fileStats = await lstat(filePath)

    if (fileStats.isDirectory() && !ignore.includes(fileName)) {
      // Recursively traverse subdirectories
      passed = (await checkAll(filePath)) && passed
    } else if (fileName.endsWith('.lf')) {
      // Invoke command on file
      try {
        await exec(`lfc "${filePath}"`)
        core.info(`✔️ ${filePath}`)
      } catch (error) {
        core.error(`❌ ${filePath} (compilation failed)`)
        passed = false
      }
    }
  }
  return passed
}
