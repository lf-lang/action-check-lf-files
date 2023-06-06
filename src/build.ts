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
  await exec('git submodule update --init', {cwd: dir})
}

export async function gradleStop(dir: string): Promise<void> {
  exec('./gradlew --stop', {cwd: dir})
}

export function configurePath(dir: string): void {
  process.env.PATH = `${process.env.PATH}:${path.join(
    path.resolve(dir),
    'bin'
  )}`
}
