import { useState, useEffect } from 'react'
import CouponCard from '../components/CouponCard'
import '../App.css'
import { useNavigate } from 'react-router-dom'

export default function SearchPage() {
  const navigate = useNavigate()

  const [catalog, setCatalog] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStore, setSelectedStore] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortMode, setSortMode] = useState('bestValue')
  const [southSJOnly, setSouthSJOnly] = useState(false)

  useEffect(() => {
    fetch('http://localhost:4000/api/coupons')
      .then(res => res.json())
      .then(data => setCatalog(data))
      .catch(err => console.error('Failed to load coupons', err))
  }, [])
  
  const stores = [...new Set(catalog.map(c => c.store))].filter(Boolean)
  const categories = [...new Set(catalog.map(c => c.category))].filter(Boolean)

  const filtered = catalog.filter(c => {
    let match = true

    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      match =
        match &&
        (c.title.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          (c.store && c.store.toLowerCase().includes(q)))
    }

    if (selectedStore !== 'All') match = match && c.store === selectedStore
    if (selectedCategory !== 'All') match = match && c.category === selectedCategory

    if (southSJOnly) {
      match =
        match &&
        (c.address ? c.address.toLowerCase().includes('san jose') : false)
    }

    return match
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortMode === 'bestValue') {
      const apu = a.unit_amount ? a.price / a.unit_amount : a.price
      const bpu = b.unit_amount ? b.price / b.unit_amount : b.price
      return apu - bpu
    }
    if (sortMode === 'popular') return b.popularity_score - a.popularity_score
    if (sortMode === 'updated')
      return new Date(b.updated_at) - new Date(a.updated_at)
    return 0
  })

  return (
    <div className="page-bg">
      <div className="app-shell">
        {/* Top nav (same layout as Home) */}
        <header className="top-nav">
          <div
            className="brand clickable-brand"
            onClick={() => navigate('/')}
          >
            <div className="brand-logo">Z</div>
            <div className="brand-text">
              <div className="brand-name">ZUNO</div>
              <div className="brand-tagline">Deals &amp; Savings</div>
            </div>
          </div>

          <nav className="nav-links">
            <button
              className="nav-link nav-link--active"
              onClick={() => navigate('/search')}
            >
              Search
            </button>
            <button
              className="nav-link"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>
          </nav>
        </header>

        <div className="header-divider" />

        <main>
          <div className="content-container">
            {/* TITLE */}
            <div className="search">
              <div className="trending-label-line" />
              <h2 className="search-title">Search Coupons</h2>
            </div>

            {/* LOCATION CHECKBOX */}
            <label className="south-sj-checkbox">
              <input
                type="checkbox"
                checked={southSJOnly}
                onChange={() => setSouthSJOnly(!southSJOnly)}
              />
              <span>📍 South San Jose only (within 10 miles)</span>
            </label>

            {/* SEARCH BAR + DROPDOWNS */}
            <div className="search-controls-shell">
              <div className="search-filter-row">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search brand or title..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />

                <select
                  className="filter-dropdown"
                  value={selectedStore}
                  onChange={e => setSelectedStore(e.target.value)}
                >
                  <option value="All">All Stores</option>
                  {stores.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <select
                  className="filter-dropdown"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {categories.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <select
                  className="filter-dropdown"
                  value={sortMode}
                  onChange={e => setSortMode(e.target.value)}
                >
                  <option value="bestValue">Best value</option>
                  <option value="popular">Most popular</option>
                  <option value="updated">Recently updated</option>
                </select>
              </div>
            </div>

            {/* AVAILABLE STORES BAR */}
            <div className="store-chip-bar">
              <div className="store-chip-bar-title">
                Available Stores in South San Jose:
              </div>
              <div className="store-chip-list">
                {stores.map(s => (
                  <div key={s} className="store-chip">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* RESULTS GRID */}
            <div className="coupon-grid">
              {sorted.map(c => (
                <CouponCard key={c.id} coupon={c} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
