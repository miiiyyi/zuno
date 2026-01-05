// backend/scripts/seed.js
// Seeds the SQLite DB with realistic-looking coupons (no scraping)

const { db, initDb } = require('../db')

// ---- generators (your existing logic) ----
const STORES = ["Safeway", "Ranch 99", "Nob Hill", "FoodMaxx", "Lucky"]

const CATALOG = [
  {
    category: "Produce",
    brands: ["Dole", "Driscoll's", "Taylor Farms", "Earthbound Farm"],
    products: [
      "Organic Bananas 3 lb",
      "Strawberries 1 lb",
      "Avocados (bag)",
      "Baby Spinach 10 oz",
      "Gala Apples 3 lb",
      "Mandarin Oranges 3 lb",
      "Fresh Salmon 1 lb",
    ],
    unitTypes: ["lb", "bag", "ct", "oz"],
  },
  {
    category: "Dairy",
    brands: ["Chobani", "Oikos", "Horizon", "Tillamook", "Lucerne"],
    products: [
      "Greek Yogurt 32 oz",
      "Milk 1 gal",
      "Shredded Cheese 8 oz",
      "Butter 1 lb",
      "Eggs 12 ct",
    ],
    unitTypes: ["oz", "gal", "lb", "ct"],
  },
  {
    category: "Bakery",
    brands: ["Dave's Killer Bread", "Sara Lee", "Oroweat"],
    products: ["Whole Wheat Bread", "Bagels (6 ct)", "Tortillas 10 ct"],
    unitTypes: ["loaf", "ct"],
  },
  {
    category: "Snacks",
    brands: ["Lay's", "Doritos", "Nature Valley", "KIND"],
    products: [
      "Chips Family Size",
      "Granola Bars (12 ct)",
      "Trail Mix 12 oz",
      "Crackers 13 oz",
    ],
    unitTypes: ["oz", "ct"],
  },
  {
    category: "Beverages",
    brands: ["Starbucks", "Coca-Cola", "LaCroix", "Gatorade"],
    products: ["Coffee 12 oz", "Sparkling Water 12 ct", "Soda 12 ct", "Sports Drink 8 ct"],
    unitTypes: ["oz", "ct"],
  },
  {
    category: "Household",
    brands: ["Dawn", "Tide", "Bounty", "Charmin"],
    products: ["Dish Soap Pack", "Laundry Detergent 92 oz", "Paper Towels 6 ct", "Toilet Paper 12 ct"],
    unitTypes: ["oz", "ct", "pack"],
  },
]

const ADDRESSES_SOUTH_SJ = [
  "1555 Branham Ln, San Jose, CA 95118",
  "777 Story Rd, San Jose, CA 95122",
  "6150 Snell Ave, San Jose, CA 95123",
  "5353 Almaden Expy, San Jose, CA 95118",
  "5650 Cottle Rd, San Jose, CA 95123",
]

const ADDRESSES_OTHER = [
  "2550 Monterey Hwy, San Jose, CA 95111",
  "1750 S Bascom Ave, Campbell, CA 95008",
  "150 E Hamilton Ave, Campbell, CA 95008",
  "777 Sunnyvale Saratoga Rd, Sunnyvale, CA 94087",
  "1700 The Alameda, San Jose, CA 95126",
]

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function pick(arr) {
  return arr[randInt(0, arr.length - 1)]
}
function round2(n) {
  return Math.round(n * 100) / 100
}

function isoDaysFromNow(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function makeBadge(price) {
  const r = Math.random()
  if (r < 0.15) return "BOGO"
  if (r < 0.35) return `${randInt(10, 30)}% off`
  const off = Math.min(randInt(1, 5), Math.max(1, Math.floor(price)))
  return `$${off} off`
}

function makeUnitAmount(unitType) {
  if (unitType === "lb") return randInt(1, 5)
  if (unitType === "oz") return pick([8, 10, 12, 16, 32, 64, 92])
  if (unitType === "ct") return pick([6, 8, 10, 12, 18, 24])
  if (unitType === "gal") return 1
  if (unitType === "loaf") return 1
  if (unitType === "pack") return pick([1, 2, 3, 4])
  if (unitType === "bag") return 1
  return 1
}

function estimatePrice(category, unitType, unitAmount) {
  const baseByCategory = {
    Produce: [1.5, 8.0],
    Dairy: [2.5, 9.5],
    Bakery: [2.5, 7.0],
    Snacks: [2.0, 10.0],
    Beverages: [3.0, 12.0],
    Household: [3.0, 18.0],
  }
  const [min, max] = baseByCategory[category] || [2.0, 10.0]

  let scale = 1
  if (unitType === "oz") scale = Math.max(1, unitAmount / 16)
  if (unitType === "ct") scale = Math.max(1, unitAmount / 12)
  if (unitType === "lb") scale = Math.max(1, unitAmount / 3)

  const raw = (min + Math.random() * (max - min)) * scale
  return round2(Math.min(raw, max * 2))
}

function generateCoupons(count = 300) {
  const out = []
  for (let i = 1; i <= count; i++) {
    const entry = pick(CATALOG)
    const category = entry.category
    const brand = pick(entry.brands)
    const title = pick(entry.products)
    const store = pick(STORES)
    const unit_type = pick(entry.unitTypes)
    const unit_amount = makeUnitAmount(unit_type)

    const price = estimatePrice(category, unit_type, unit_amount)
    const address = Math.random() < 0.6 ? pick(ADDRESSES_SOUTH_SJ) : pick(ADDRESSES_OTHER)

    const createdDaysAgo = randInt(2, 30)
    const updatedDaysAgo = randInt(0, Math.max(0, createdDaysAgo - 1))
    const created_at = isoDaysFromNow(-createdDaysAgo)
    const updated_at = isoDaysFromNow(-updatedDaysAgo)
    const end_at = isoDaysFromNow(randInt(3, 45))

    out.push({
      id: `c${i}`,
      title,
      brand,
      category,
      store,
      price,
      unit_amount,
      unit_type,
      created_at,
      updated_at,
      end_at,
      popularity_score: round2(Math.random()),
      badge: makeBadge(price),
      address,
    })
  }
  return out
}

// ---- write to SQLite ----
const count = Number(process.argv[2] || 300)

initDb()

// wipe existing rows so seed is repeatable
db.exec(`DELETE FROM coupons`)

const insert = db.prepare(`
  INSERT INTO coupons (
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

const coupons = generateCoupons(count)
const tx = db.transaction((rows) => {
  for (const r of rows) insert.run(r)
})
tx(coupons)

console.log(`Seeded ${coupons.length} coupons into SQLite (zuno.sqlite)`)
