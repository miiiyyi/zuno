import './App.css'
import catalog from './data/catalog.json'
import CouponCard from './components/CouponCard'
import { useState } from 'react' 
import { useNavigate } from 'react-router-dom'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  return (
    <div className="page-bg">
      <div className="app-shell">
        {/* Top nav */}
        <header className="top-nav">
          <div className="brand"
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
            <button className="nav-link"
            onClick={() => navigate('/search')}
            >
              Search
            </button>
            <button className="nav-link"
            onClick={() => navigate('/dashboard')}
            >
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
                <button
                  className="hero-button"
                  onClick={() => navigate('/search')}
                >
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

              <div className="coupon-grid">
                {catalog.map(coupon => (
                  <CouponCard key={coupon.id} coupon={coupon} />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
