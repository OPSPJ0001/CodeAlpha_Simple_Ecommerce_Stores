# Simple E‑commerce Store (Express.js + SQLite)

> Internship Project – **Task 1: Simple E-commerce Store** (Frontend: HTML/CSS/JS • Backend: Express.js • DB: SQLite)

**Features**  
- Product listing and product details page  
- Shopping cart (client-side, localStorage)  
- User registration & login (JWT)  
- Order processing (creates orders & order items in DB)  
- Minimal, clean UI with vanilla HTML/CSS/JS  
- Ready for GitHub submission

## Quick Start

```bash
# 1) Clone and install
npm install

# 2) Initialize the SQLite database (schema + seed products)
npm run db:reset

# 3) Run the server
npm run dev
# App runs on http://localhost:3000
```

Create a `.env` file (optional; `.env.example` included):

```
PORT=3000
JWT_SECRET=change_me_pls
```

## API Overview

- `POST /api/auth/register` → `{ name, email, password }`  
- `POST /api/auth/login` → `{ email, password }` returns `{ user, token }`

- `GET /api/products` → list products  
- `GET /api/products/:id` → product details

- `POST /api/orders` (auth required: Bearer token)  
  Body: `{ items: [ { productId, quantity } ] }`  
  Creates an order and returns `{ orderId, total }`

- `GET /api/orders/mine` (auth required) → list your orders

## Folder Structure

```
simple-ecommerce-express/
├─ public/           # Front-end (static)
├─ scripts/          # DB init script
├─ src/              # Back-end source
│  ├─ routes/        # API routes
│  ├─ middleware/    # JWT auth
│  ├─ schema.sql     # DB schema
│  ├─ seed.sql       # Seed products
│  └─ db.js          # SQLite connection
├─ data/             # SQLite file (created at runtime)
├─ server.js         # Express app
├─ package.json
└─ README.md
```

## Notes for Submission

- This project keeps the cart on the client (simpler for demonstration).  
- For production, consider server-side carts, payment integration, and validations.
- You can deploy to Render, Railway, Fly.io, or any Node host.

---

Built for the internship task by **codealpha.tech** guidelines.
