import {simpleGit} from 'simple-git'
import * as child_process from 'child_process'
import {rm} from 'node:fs/promises'
import * as path from 'node:path'
import {promisify} from 'util'

const exec = promisify(child_process.exec)

export async function deleteIfExists(dir: string): Promise<void> {
  return rm(dir, {recursive: true, force: true})
}

export async function clone(ref: string, dir: string): Promise<void> {
  const git = simpleGit()
  await git.clone('https://github.com/lf-lang/lingua-franca.git', dir)
}

export async function build(dir: string): Promise<void> {
  const dir_up = `${dir}/..`
  await exec('ls -la', {cwd: dir},
   function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
          console.log('exec error: ' + error);
      }
   })
  console.log(myOutput);
  console.log(myError);
  await exec('ls -la', {cwd: dir_up},
   function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
          console.log('exec error: ' + error);
      }
   })
  exec('./gradlew clean assemble', {cwd: dir})
}

export function configurePath(dir: string): void {
  process.env.PATH = `${process.env.PATH}:${path.join(
    path.resolve(dir),
    'bin'
  )}`
}
