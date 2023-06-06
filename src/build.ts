import {simpleGit} from 'simple-git'
import * as child_process from 'child_process'
import {rm} from 'node:fs/promises'
import * as path from 'node:path'
import {promisify} from 'util'

const exec = promisify(child_process.exec)
let myOutput = '';
let myError = '';

const options = {
listeners: {
stdout: (data: Buffer) => {
myOutput += data.toString();
},
stderr: (data: Buffer) => {
myError += data.toString();
}
}
};

export async function deleteIfExists(dir: string): Promise<void> {
  return rm(dir, {recursive: true, force: true})
}

export async function clone(ref: string, dir: string): Promise<void> {
  const git = simpleGit()
  await git.clone('https://github.com/lf-lang/lingua-franca.git', dir)
}

export async function build(dir: string): Promise<void> {
  const dir_up = `${dir}/..`
  await exec('ls -la', {cwd: dir, stdout: (data: Buffer) => { myOutput += data.toString(); }, stderr: (data: Buffer) => { myError += data.toString(); }})
  console.log(myOutput);
  console.log(myError);
  await exec('ls -la', {cwd: dir_up, stdout: (data: Buffer) => { myOutput += data.toString(); }, stderr: (data: Buffer) => { myError += data.toString(); }})
  myOutput = ''
  myError = ''
  console.log(myOutput);
  console.log(myError);
  exec('./gradlew clean assemble', {cwd: dir})
}

export function configurePath(dir: string): void {
  process.env.PATH = `${process.env.PATH}:${path.join(
    path.resolve(dir),
    'bin'
  )}`
}
