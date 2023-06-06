import * as fs from 'fs'
import * as cp from 'child_process'
import {promisify} from 'util'
import * as core from '@actions/core'

const readdir = promisify(fs.readdir)
const lstat = promisify(fs.lstat)
const exec = promisify(cp.exec)

// FIXME: allow wildcards?
export const skipDirs = ['node_modules', 'src-gen', 'fed-gen']

export async function checkAll(
  dir: string,
  noCompile: boolean
): Promise<boolean> {
  let passed = true

  const files = await readdir(dir)

  for (const fileName of files) {
    const filePath = `${dir}/${fileName}`
    const fileStats = await lstat(filePath)

    if (fileStats.isDirectory()) {
      // Recursively traverse subdirectories
      if (!skipDirs.includes(fileName)) {
        passed = (await checkAll(filePath, noCompile)) && passed
      }
    } else if (fileName.endsWith('.lf')) {
      // Invoke command on file
      try {
        await exec(`lfc ${noCompile ? '--no-compile' : ''} "${filePath}"`, {
          env: process.env
        })
        core.info(`✔️ ${filePath}`)
      } catch (error) {
        core.info(`❌ ${filePath} (compilation failed)`)
        passed = false
      }
    }
  }
  return passed
}
