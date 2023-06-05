import {simpleGit} from 'simple-git'
import * as cp from 'child_process'
import {rm} from 'node:fs/promises'
import * as path from 'node:path'

export async function deleteIfExists(dir: string): Promise<void> {
  return rm(dir, {recursive: true, force: true})
}

export async function clone(ref: string, dir: string): Promise<void> {
  const git = simpleGit()
  await git.clone('git@github.com:lf-lang/lingua-franca.git', dir)
}

export async function build(dir: string): Promise<void> {
  cp.exec('./gradlew assemble', {cwd: dir})
}

export function configurePath(dir: string): void {
  process.env.PATH = `${process.env.PATH}:${path.join(
    path.resolve(dir),
    'bin'
  )}`
}
