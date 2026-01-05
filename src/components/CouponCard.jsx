import { useState } from 'react'
import qrPlaceholder from '../assets/qr-placeholder.png'
import '../App.css'

const SAVED_KEY = 'zuno_saved_coupons'

function formatDate(iso) {
  if (!iso) return 'N/A'
  return new Date(iso).toLocaleDateString()
}

function getBadge(coupon) {
  return coupon.badge || 'Deal'
}

export default function CouponCard({
  coupon,
  showSave = true,
  showRemove = false,
  onRemove,
}) {
  const [showQR, setShowQR] = useState(false)

  const toggleQR = () => setShowQR(prev => !prev)

  const handleSave = () => {
    try {
      const raw = localStorage.getItem(SAVED_KEY)
      const existing = raw ? JSON.parse(raw) : []

      // avoid duplicates by id
      if (!existing.some(x => x.id === coupon.id)) {
        const updated = [coupon, ...existing] // put newest on top
        localStorage.setItem(SAVED_KEY, JSON.stringify(updated))
      }
    } catch (e) {
      console.error('Failed to save coupon', e)
    }
  }

  return (
    <div className="coupon-card">
      <div className="coupon-header">
        <h3 className="coupon-title">{coupon.title}</h3>
        <span className="coupon-badge">{getBadge(coupon)}</span>
      </div>

      <div className="coupon-meta">
        <span>{coupon.brand}</span>
        <span>{coupon.store}</span>
        {coupon.category && <span>{coupon.category}</span>}
      </div>

      <div className="coupon-location">
        <span className="location-pin">📍</span>
        <span>{coupon.address || 'Local store · San Jose, CA'}</span>
      </div>

      <div className="coupon-expiry">
        Expires: <span>{formatDate(coupon.end_at)}</span>
      </div>

      {showQR && (
        <div className="qr-panel-expanded">
          <img src={qrPlaceholder} className="qr-image-expanded" alt="QR code" />
          <div className="qr-caption-expanded">Scan at checkout</div>

          <button className="close-qr-btn" onClick={() => setShowQR(false)}>
            Close
          </button>
        </div>
      )}

      <div className="coupon-footer">
        <button className="action-btn qr-btn" onClick={toggleQR}>
          {showQR ? 'Hide QR' : 'Show QR'}
        </button>

        {showSave && (
          <button className="action-btn save-btn" onClick={handleSave}>
            Save
          </button>
        )}
      </div>

      {showRemove && (
        <button
          className="remove-btn"
          onClick={() => onRemove && onRemove(coupon.id)}
        >
          Remove
        </button>
      )}
    </div>
  )
}
