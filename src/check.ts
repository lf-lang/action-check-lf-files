import * as fs from 'fs'
import * as cp from 'child_process'
import {promisify} from 'util'
import * as core from '@actions/core'

const readdir = promisify(fs.readdir)
const lstat = promisify(fs.lstat)
const exec = promisify(cp.exec)

// FIXME: allow wildcards?
export const skipDirs = ['node_modules', 'src-gen', 'fed-gen']

export async function checkCompile(
  dir: string,
  noCompile: boolean
): Promise<number> {
  return checkAll(
    dir,
    async filePath =>
      await exec(`lfc ${noCompile ? '--no-compile' : ''} "${filePath}"`, {
        env: process.env
      })
  )
}

export async function checkFormat(dir: string): Promise<number> {
  return checkAll(
    dir,
    async filePath =>
      await exec(`lff --check "${filePath}"`, {
        env: process.env
      })
  )
}

async function checkAll(
  dir: string,
  cmd: (arg: string) => Promise<unknown>
): Promise<number> {
  let failures = 0

  const files = await readdir(dir)

  for (const fileName of files) {
    const filePath = `${dir}/${fileName}`
    const fileStats = await lstat(filePath)

    if (fileStats.isDirectory()) {
      // Recursively traverse subdirectories
      if (!skipDirs.includes(fileName)) {
        failures += await checkAll(filePath, cmd)
      }
    } else if (fileName.endsWith('.lf')) {
      // Invoke command on file
      try {
        await cmd(filePath)
        core.info(`✔️ ${filePath}`)
      } catch (error) {
        core.info(`❌ ${filePath}`)
        core.error(String(error))
        failures++
      }
    }
  }
  return failures
}
