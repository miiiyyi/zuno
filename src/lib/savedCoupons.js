const SAVED_KEY = 'zuno_saved_coupons'

export function getSaved() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')
  } catch {
    return []
  }
}

export function isSaved(id) {
  return getSaved().some(c => c.id === id)
}

export function saveCoupon(coupon) {
  const saved = getSaved()
  if (saved.some(c => c.id === coupon.id)) return
  localStorage.setItem(SAVED_KEY, JSON.stringify([coupon, ...saved]))
}

export function removeCoupon(id) {
  const saved = getSaved().filter(c => c.id !== id)
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved))
}

export { SAVED_KEY }
