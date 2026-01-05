import './App.css'
import CouponCard from './components/CouponCard'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function App() {
  const navigate = useNavigate()

  // backend coupons
  const [catalog, setCatalog] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:4000/api/coupons')
      .then(res => {
        if (!res.ok) throw new Error(`Backend error: ${res.status}`)
        return res.json()
      })
      .then(data => {
        setCatalog(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load coupons', err)
        setError('Could not load coupons. Is the backend running on :4000?')
        setLoading(false)
      })
  }, [])

  // Trending = top 8 by popularity_score (fallback 0)
  const trending = [...catalog]
    .sort((a, b) => (b.popularity_score ?? 0) - (a.popularity_score ?? 0))
    .slice(0, 8)

  return (
    <div className="page-bg">
      <div className="app-shell">
        {/* Top nav */}
        <header className="top-nav">
          <div
            className="brand"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
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
            <button className="nav-link" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          </nav>
        </header>

        <div className="header-divider"></div>

        <main>
          <div className="content-container">
            {/* Hero section */}
            <section className="hero">
              <div className="hero-content">
                <h1 className="hero-title">Find the best local grocery deals</h1>
                <p className="hero-subtitle">
                  No paywalls. No ad clutter. Just pure value.
                </p>
                <button className="hero-button" onClick={() => navigate('/search')}>
                  Start searching →
                </button>
              </div>
            </section>

            {/* Trending section */}
            <section id="trending" className="trending-section">
              <div className="trending-header">
                <div className="trending-label-line" />
                <h2 className="trending-title">Trending near you</h2>
              </div>

              {loading && <p style={{ opacity: 0.8 }}>Loading deals…</p>}
              {error && <p style={{ color: '#fca5a5' }}>{error}</p>}

              {!loading && !error && (
                <div className="coupon-grid">
                  {trending.map(coupon => (
                    <CouponCard key={coupon.id} coupon={coupon} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
