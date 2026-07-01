const BASE = '/api'

export async function api(act, data = {}) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ act, ...data })
  })
  return res.json()
}

