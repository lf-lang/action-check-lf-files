import * as fs from 'fs'
import * as child_process from 'child_process'
import {promisify} from 'util'
import * as core from '@actions/core'

const readdir = promisify(fs.readdir)
const lstat = promisify(fs.lstat)
const exec = promisify(child_process.exec)

export async function check(dir: string): Promise<boolean> {
  let passed = true

  const files = await readdir(dir)

  for (const fileName of files) {
    const filePath = `${dir}/${fileName}`
    const fileStats = await lstat(filePath)

    if (fileStats.isDirectory() && fileName !== 'lingua-franca') {
      // Recursively traverse subdirectories
      passed = (await check(filePath)) && passed
    } else if (fileName.endsWith('.lf')) {
      // Invoke command on file
      try {
        await exec(`lfc "${filePath}"`)
        core.info(`✅ ${filePath}`)
      } catch (error) {
        core.error(`❌ ${filePath}`)
        passed = false
      }
    }
  }
  return passed
}
