import { spawnSync } from 'node:child_process'
import { readlinkSync } from 'node:fs'
import { resolve, sep } from 'node:path'

const rootDirectory = resolve(import.meta.dirname, '..')
const developmentPorts = ['4000', '5173']
const projectListeners = new Set()

const isInsideProject = (directory) =>
  directory === rootDirectory || directory.startsWith(`${rootDirectory}${sep}`)

for (const port of developmentPorts) {
  const result = spawnSync('lsof', ['-t', `-iTCP:${port}`, '-sTCP:LISTEN'], {
    encoding: 'utf8',
  })

  for (const value of result.stdout?.trim().split(/\s+/) ?? []) {
    const pid = Number(value)
    if (!Number.isInteger(pid) || pid === process.pid) continue

    try {
      const workingDirectory = readlinkSync(`/proc/${pid}/cwd`)
      if (isInsideProject(workingDirectory)) projectListeners.add(pid)
    } catch {
      // The process may already have stopped.
    }
  }
}

for (const pid of projectListeners) {
  try {
    process.kill(pid, 'SIGTERM')
  } catch {
    // The process may already have stopped.
  }
}

if (projectListeners.size > 0) {
  process.stdout.write('✓ Development services stopped.\n')
}
