import { spawn, spawnSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { delimiter, resolve } from 'node:path'
import process from 'node:process'

const rootDirectory = resolve(import.meta.dirname, '..')
const clientDirectory = resolve(rootDirectory, 'client')
const androidDirectory = resolve(clientDirectory, 'android')
const userHomeDirectory = process.env.HOME ?? ''
const defaultSdkDirectory = resolve(userHomeDirectory, 'Android', 'Sdk')
const localJdkDirectory = resolve(
  userHomeDirectory,
  '.local',
  'share',
  'linguatube',
)

const output = (message) => process.stdout.write(`${message}\n`)
const pause = (milliseconds) =>
  new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds))

const findJavaHome = () => {
  if (
    process.env.JAVA_HOME &&
    existsSync(resolve(process.env.JAVA_HOME, 'bin', 'javac'))
  ) {
    return process.env.JAVA_HOME
  }

  if (!existsSync(localJdkDirectory)) return undefined

  return readdirSync(localJdkDirectory, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        entry.name.startsWith('jdk-21') &&
        existsSync(resolve(localJdkDirectory, entry.name, 'bin', 'javac')),
    )
    .map((entry) => resolve(localJdkDirectory, entry.name))
    .sort()
    .at(-1)
}

const javaHome = findJavaHome()
const sdkDirectory =
  process.env.ANDROID_HOME ||
  process.env.ANDROID_SDK_ROOT ||
  (existsSync(defaultSdkDirectory) ? defaultSdkDirectory : undefined)
const sdkAdb = sdkDirectory
  ? resolve(sdkDirectory, 'platform-tools', 'adb')
  : undefined
const adbCommand = sdkAdb && existsSync(sdkAdb) ? sdkAdb : 'adb'
const extraPathEntries = [
  javaHome ? resolve(javaHome, 'bin') : undefined,
  sdkDirectory ? resolve(sdkDirectory, 'platform-tools') : undefined,
].filter(Boolean)

const commandEnvironment = {
  ...process.env,
  CAPACITOR_LIVE_RELOAD: 'true',
  ...(javaHome ? { JAVA_HOME: javaHome } : {}),
  ...(sdkDirectory
    ? {
        ANDROID_HOME: sdkDirectory,
        ANDROID_SDK_ROOT: sdkDirectory,
      }
    : {}),
  PATH: [...extraPathEntries, process.env.PATH ?? ''].join(delimiter),
}

let capacitorProcess

const stopCapacitorProcess = () => {
  if (!capacitorProcess?.pid) return

  try {
    if (process.platform === 'win32') {
      capacitorProcess.kill('SIGTERM')
    } else {
      process.kill(-capacitorProcess.pid, 'SIGTERM')
    }
  } catch {
    // The native build may already have stopped.
  }
}

const shutDown = () => {
  stopCapacitorProcess()
  process.exit(0)
}

process.once('SIGINT', shutDown)
process.once('SIGTERM', shutDown)

const run = (command, args, options = {}) =>
  spawnSync(command, args, {
    cwd: clientDirectory,
    env: commandEnvironment,
    encoding: 'utf8',
    ...options,
  })

const commandOutput = (result) =>
  [result.stdout, result.stderr]
    .filter(Boolean)
    .join('\n')
    .trim()
    .slice(-12_000)

const readDevices = () => {
  const adbResult = run(adbCommand, ['devices', '-l'])

  if (adbResult.error?.code === 'ENOENT') {
    return {
      fatal:
        '⚠ Android platform-tools (adb) are not installed. Install ADB, then restart npm run dev.',
    }
  }

  if (adbResult.status !== 0) {
    return {
      message:
        '⚠ Android device check failed. Check the USB connection and USB debugging.',
    }
  }

  const devices = adbResult.stdout
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [serial = '', state = 'unknown'] = line.split(/\s+/, 2)
      return { serial, state }
    })

  const connectedDevice = devices.find(({ state }) => state === 'device')
  if (connectedDevice) return { device: connectedDevice }

  const unauthorized = devices.some(({ state }) => state === 'unauthorized')
  return {
    message: unauthorized
      ? '⚠ Android device found but not authorized. Unlock it and accept the USB debugging prompt.'
      : '⚠ No Android device found with USB debugging enabled. Check mobile connection and USB debugging.',
  }
}

const waitForDevice = async () => {
  let lastMessage

  while (true) {
    const status = readDevices()

    if (status.fatal) {
      output(status.fatal)
      return undefined
    }

    if (status.device) return status.device

    if (status.message !== lastMessage) {
      output(status.message)
      output(
        '… Waiting for an Android device. Web and API development remain available.',
      )
      lastMessage = status.message
    }

    await pause(2_000)
  }
}

const waitForWebServer = async () => {
  const deadline = Date.now() + 60_000

  while (Date.now() < deadline) {
    try {
      const response = await fetch('http://127.0.0.1:5173')
      if (response.ok) return true
    } catch {
      // Vite is still starting.
    }

    await pause(750)
  }

  return false
}

const forwardDevelopmentPorts = (serial) => {
  for (const port of ['5173', '4000']) {
    const reverseResult = run(adbCommand, [
      '-s',
      serial,
      'reverse',
      `tcp:${port}`,
      `tcp:${port}`,
    ])

    if (reverseResult.status !== 0) return false
  }

  return true
}

const runCapacitor = (serial) =>
  new Promise((resolvePromise) => {
    let buildOutput = ''
    let settled = false
    capacitorProcess = spawn(
      'npx',
      ['cap', 'run', 'android', '--target', serial, '--no-sync'],
      {
        cwd: clientDirectory,
        env: commandEnvironment,
        detached: process.platform !== 'win32',
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    )

    const finish = (result) => {
      if (settled) return
      settled = true
      capacitorProcess = undefined
      resolvePromise(result)
    }

    const collectOutput = (chunk) => {
      buildOutput = `${buildOutput}${chunk}`.slice(-20_000)
    }

    capacitorProcess.stdout.on('data', collectOutput)
    capacitorProcess.stderr.on('data', collectOutput)
    capacitorProcess.on('error', (error) => {
      finish({ code: 1, output: error.message })
    })
    capacitorProcess.on('exit', (code) => {
      finish({ code: code ?? 1, output: buildOutput.trim() })
    })
  })

if (!existsSync(androidDirectory)) {
  output(
    '⚠ Capacitor Android project is missing. Run npm run android:setup once.',
  )
  process.exit(0)
}

if (!javaHome) {
  output(
    '⚠ JDK 21 is missing. Android was skipped; web and API development remain available.',
  )
  process.exit(0)
}

if (!sdkDirectory) {
  output(
    '⚠ Android SDK is missing. Android was skipped; web and API development remain available.',
  )
  process.exit(0)
}

const connectedDevice = await waitForDevice()
if (!connectedDevice) process.exit(0)

output(`✓ Android device connected: ${connectedDevice.serial}`)

if (!(await waitForWebServer())) {
  output(
    '⚠ Web server did not become ready. Android live reload was not started.',
  )
  process.exit(0)
}

if (!forwardDevelopmentPorts(connectedDevice.serial)) {
  output(
    '⚠ Could not enable USB live reload. Check the cable and USB debugging authorization.',
  )
  process.exit(0)
}

output('↻ Syncing the Android project…')
const syncResult = run('npx', ['cap', 'sync', 'android'])

if (syncResult.status !== 0) {
  output('⚠ Capacitor sync failed. Web and API development are still running.')
  const details = commandOutput(syncResult)
  if (details) output(details)
  process.exit(0)
}

output('↻ Building and launching LinguaTube on Android…')
const launchResult = await runCapacitor(connectedDevice.serial)

if (launchResult.code !== 0) {
  output(
    '⚠ Android build or launch failed. Web and API development are still running.',
  )
  if (launchResult.output) output(launchResult.output)
  process.exit(0)
}

output(
  '✓ Android live reload ready. UI edits will refresh on the connected phone.',
)

let activeSerial = connectedDevice.serial
let wasConnected = true

while (true) {
  await pause(2_000)
  const status = readDevices()
  const currentDevice = status.device

  if (!currentDevice) {
    if (wasConnected) {
      output(
        status.message ??
          '⚠ No Android device found. Check mobile connection and USB debugging.',
      )
      output('… Waiting to restore Android live reload.')
      wasConnected = false
    }
    continue
  }

  if (wasConnected && currentDevice.serial === activeSerial) continue

  activeSerial = currentDevice.serial
  if (!forwardDevelopmentPorts(activeSerial)) continue

  run(adbCommand, [
    '-s',
    activeSerial,
    'shell',
    'am',
    'start',
    '-n',
    'com.linguatube.app/.MainActivity',
  ])
  output(`✓ Android reconnected: ${activeSerial}. Live reload restored.`)
  wasConnected = true
}
