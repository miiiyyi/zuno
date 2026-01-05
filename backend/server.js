// backend/server.js
const express = require('express')
const cors = require('cors')
const { db, initDb } = require('./db')

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

initDb()

app.get('/', (req, res) => {
  res.send('ZUNO backend (SQLite) is running')
})

// Helper: build WHERE clause safely
function buildCouponFilters({ q, store, category, southSJOnly }) {
  const where = []
  const params = {}

  if (q) {
    params.q = `%${q.toLowerCase()}%`
    where.push(`(
      LOWER(title) LIKE @q OR
      LOWER(brand) LIKE @q OR
      LOWER(store) LIKE @q
    )`)
  }

  if (store && store !== 'All') {
    params.store = store
    where.push(`store = @store`)
  }

  if (category && category !== 'All') {
    params.category = category
    where.push(`category = @category`)
  }

  if (southSJOnly === 'true') {
    // simple string match like your current logic
    where.push(`address IS NOT NULL AND LOWER(address) LIKE '%san jose%'`)
  }

  return { whereSql: where.length ? `WHERE ${where.join(' AND ')}` : '', params }
}

/**
 * GET /api/coupons
 * Optional query params: q, store, category, southSJOnly
 */
app.get('/api/coupons', (req, res) => {
  const { q, store, category, southSJOnly } = req.query
  const { whereSql, params } = buildCouponFilters({ q, store, category, southSJOnly })

  const stmt = db.prepare(`
    SELECT *
    FROM coupons
    ${whereSql}
    ORDER BY datetime(updated_at) DESC
  `)

  const rows = stmt.all(params)
  res.json(rows)
})

// GET /api/stores
app.get('/api/stores', (req, res) => {
  const rows = db.prepare(`
    SELECT DISTINCT store
    FROM coupons
    WHERE store IS NOT NULL AND store != ''
    ORDER BY store ASC
  `).all()

  res.json(rows.map(r => r.store))
})

// GET /api/categories
app.get('/api/categories', (req, res) => {
  const rows = db.prepare(`
    SELECT DISTINCT category
    FROM coupons
    WHERE category IS NOT NULL AND category != ''
    ORDER BY category ASC
  `).all()

  res.json(rows.map(r => r.category))
})

// POST /api/coupons (create coupon)
app.post('/api/coupons', (req, res) => {
  const c = req.body

  // Basic validation
  const required = ['id', 'title', 'brand', 'category', 'store', 'price', 'end_at']
  for (const key of required) {
    if (c[key] === undefined || c[key] === null || c[key] === '') {
      return res.status(400).json({ error: `Missing required field: ${key}` })
    }
  }

  const now = new Date().toISOString()

  const row = {
    id: String(c.id),
    title: String(c.title),
    brand: String(c.brand),
    category: String(c.category),
    store: String(c.store),
    price: Number(c.price),
    unit_amount: c.unit_amount ?? null,
    unit_type: c.unit_type ?? null,
    created_at: c.created_at ?? now,
    updated_at: now,
    end_at: String(c.end_at),
    popularity_score: c.popularity_score ?? 0,
    badge: c.badge ?? null,
    address: c.address ?? null
  }

  const insert = db.prepare(`
    INSERT OR REPLACE INTO coupons (
      id, title, brand, category, store, price,
      unit_amount, unit_type,
      created_at, updated_at, end_at,
      popularity_score, badge, address
    ) VALUES (
      @id, @title, @brand, @category, @store, @price,
      @unit_amount, @unit_type,
      @created_at, @updated_at, @end_at,
      @popularity_score, @badge, @address
    )
  `)

  insert.run(row)
  res.status(201).json(row)
})

// DELETE /api/coupons/:id
app.delete('/api/coupons/:id', (req, res) => {
  const { id } = req.params
  const info = db.prepare(`DELETE FROM coupons WHERE id = ?`).run(id)

  if (info.changes === 0) {
    return res.status(404).json({ error: 'Coupon not found' })
  }

  res.json({ ok: true, deleted: id })
})

app.listen(PORT, () => {
  console.log(`ZUNO backend listening on http://localhost:${PORT}`)
})
