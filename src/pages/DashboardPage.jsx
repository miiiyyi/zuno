import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CouponCard from '../components/CouponCard'
import '../App.css'

const SAVED_KEY = 'zuno_saved_coupons'

export default function DashboardPage() {
  const [savedCoupons, setSavedCoupons] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      setSavedCoupons(parsed)
    } catch (e) {
      console.error('Failed to load saved coupons', e)
      setSavedCoupons([])
    }
  }, [])

  const handleRemove = (id) => {
    const updated = savedCoupons.filter(x => x.id !== id)
    setSavedCoupons(updated)
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated))
  }

  return (
    <div className="page-bg">
      <div className="app-shell">
        <header className="top-nav">
          <div className="brand clickable-brand" onClick={() => navigate('/')}>
            <div className="brand-logo">Z</div>
            <div className="brand-text">
              <div className="brand-name">ZUNO</div>
              <div className="brand-tagline">Deals &amp; Savings</div>
            </div>
          </div>

          <nav className="nav-links">
            <button className="nav-link" onClick={() => navigate('/search')}>
              Search
            </button>
            <button className="nav-link nav-link--active" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          </nav>
        </header>

        <div className="header-divider" />

        <main>
          <div className="content-container">
            <div className="dashboard">
              <div className="saved-label-line" />
              <h2 className="saved-title">Your Saved Coupons</h2>
            </div>

            {savedCoupons.length === 0 ? (
              <p className="saved-empty">
                You haven&apos;t saved any coupons yet. Go to Search and tap &quot;Save&quot; on a deal.
              </p>
            ) : (
              <div className="saved-grid">
                {savedCoupons.map(coupon => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    showSave={false}
                    showRemove={true}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
