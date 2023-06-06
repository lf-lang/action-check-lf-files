import * as fs from 'fs'
import * as cp from 'child_process'
import {promisify} from 'util'
import * as core from '@actions/core'

const readdir = promisify(fs.readdir)
const lstat = promisify(fs.lstat)

export const skipDirs = [
  'node_modules',
  'src-gen',
  'gh-action-test-0',
  'gh-action-test-1',
  'gh-action-test-2'
]

async function run(
  cmd: string,
  options?: cp.ExecOptions
): Promise<string | Buffer> {
  return new Promise((resolve, reject) => {
    cp.exec(cmd, options, (error, stdout, stderr) => {
      if (error) return reject(error)
      if (stderr) return reject(stderr)
      resolve(stdout)
    })
  })
}

function skipDir(dirName: string, skipFailed: boolean): boolean {
  if (skipDirs.includes(dirName) || (skipFailed && dirName.includes('fail'))) {
    return true
  }
  return false
}

export async function checkAll(lfDir: string, dir: string, ignore: boolean): Promise<boolean> {
  let passed = true

  const files = await readdir(dir)

  for (const fileName of files) {
    const filePath = `${dir}/${fileName}`
    const fileStats = await lstat(filePath)

    if (fileStats.isDirectory()) {
      // Recursively traverse subdirectories
      if (!skipDir(fileName, ignore)) {
        passed = (await checkAll(lfDir, filePath, ignore)) && passed
      }
    } else if (fileName.endsWith('.lf')) {
      // Invoke command on file
      try {
        const options: cp.ExecOptions = {
          env: process.env
        }
        await run(`${lfDir}/bin/lfc "${filePath}"`, options)
        core.info(`✔️ ${filePath}`)
      } catch (error) {
        core.info(`❌ ${filePath} (compilation failed)`)
        passed = false
      }
    }
  }
  return passed
}
