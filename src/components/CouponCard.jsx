import { useState } from 'react'
import qrPlaceholder from '../assets/qr-placeholder.png'   // make sure this exists
import '../App.css'
const SAVED_KEY = 'zuno_saved_coupons'

function formatDate(iso) {
    return new Date(iso).toLocaleDateString()
  }
  
  // For now, if your JSON doesn’t have coupon.badge, we show "Deal"
  function getBadge(coupon) {
    return coupon.badge || 'Deal'
  }
  
  export default function CouponCard({ coupon }) {
    const [showQR, setShowQR] = useState(false)

    const toggleQR = () => {
      setShowQR(!showQR)
    }

    const handleSave = () => {
      try {
        const raw = localStorage.getItem(SAVED_KEY)
        const existing = raw ? JSON.parse(raw) : []
  
        // avoid duplicates by id
        if (!existing.find(c => c.id === coupon.id)) {
          const updated = [...existing, coupon]
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
  
        {/* Location placeholder – later you can add real address/city fields */}
        <div className="coupon-location">
            <span className="location-pin">📍</span>
            <span>{coupon.address || 'Local store · San Jose, CA'}</span>
        </div>
  
        <div className="coupon-expiry">
          Expires: <span>{formatDate(coupon.end_at)}</span>
        </div>
  
        {/* QR PANEL (EXPANDED VIEW) */}
        {showQR && (
          <div className="qr-panel-expanded">
            <img src={qrPlaceholder} className="qr-image-expanded" />
            <div className="qr-caption-expanded">Scan at checkout</div>

            <button className="close-qr-btn" onClick={() => setShowQR(false)}>
              Close
            </button>
          </div>
        )}

        {/* FOOTER BUTTONS */}
        <div className="coupon-footer">
          <button className="action-btn qr-btn" onClick={toggleQR}>
            {showQR ? "Hide QR" : "Show QR"}
          </button>

          <button className="action-btn save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    )
  }
  