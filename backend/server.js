// backend/server.js
const express = require('express') // the web server
const cors = require('cors') // CORS allows your frontend (http://localhost:5173) to talk to your backend (http://localhost:4000).
const catalog = require('./data/catalog.json')

const app = express() // Initialize the app
const PORT = 4000

app.use(cors()) // Allows other apps (like your frontend) to request data from this server.
app.use(express.json()) 

// Basic health check
app.get('/', (req, res) => {
  res.send('ZUNO backend is running')
})

/**
 * GET /api/coupons
 * Optional query params: q, store, category, southSJOnly
 * Example: /api/coupons?q=apple&store=Safeway&category=Produce
 */
app.get('/api/coupons', (req, res) => {
  const { q, store, category, southSJOnly } = req.query

  let results = [...catalog]

  if (q) {
    const query = q.toLowerCase()
    results = results.filter(coupon =>
      coupon.title.toLowerCase().includes(query) ||
      coupon.brand.toLowerCase().includes(query) ||
      (coupon.store && coupon.store.toLowerCase().includes(query))
    )
  }

  if (store && store !== 'All') {
    results = results.filter(coupon => coupon.store === store)
  }

  if (category && category !== 'All') {
    results = results.filter(coupon => coupon.category === category)
  }

  if (southSJOnly === 'true') {
    results = results.filter(coupon =>
      coupon.address &&
      coupon.address.toLowerCase().includes('san jose')
    )
  }

  res.json(results)
})

app.listen(PORT, () => {
  console.log(`ZUNO backend listening on http://localhost:${PORT}`)
})
