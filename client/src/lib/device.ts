const DEVICE_KEY = 'linguatube-device-id'

export const getDeviceId = () => {
  const existing = localStorage.getItem(DEVICE_KEY)
  if (existing) return existing

  const id = `device_${crypto.randomUUID()}`
  localStorage.setItem(DEVICE_KEY, id)
  return id
}
