# ShopEasy: Full-Stack E-Commerce

A full-stack online store: browse products, search and filter, manage a cart, register and log in, place orders and view order history.

## Demo account

| Email | Password |
|---|---|
| demo@shopeasy.com | demo1234 |

You can also register your own account.

## Database

The updated task brief no longer requires MongoDB, so data is stored in JSON files inside `server/data/`:

- `products.json`: the product catalogue (committed to the repo)
- `users.json`: registered users, with **hashed** passwords (created at runtime, not committed)
- `orders.json`: placed orders (created at runtime, not committed)

All reads and writes go through one small module, `server/db.js`.

## Features

- Home page with product grid, **search** and **category filter**
- Product details page (`/product/:id`), rendered from data, with no hard-coded pages per product
- **Shopping cart**: add items, change quantity, remove items, live subtotal and total. The cart is saved in the browser, so it survives a refresh
- **Registration and login** with bcrypt-hashed passwords and **JWT** tokens
- **Protected routes**: Checkout and My Orders need a login (frontend `ProtectedRoute` plus backend `protect` middleware)
- **Checkout** with delivery details and an order summary, then **order history**
- The server calculates order totals itself from its own product data and never trusts prices sent by the browser
- Input validation and clear error messages on both the frontend and the backend
- Responsive layout for mobile and desktop

## Tech stack

- **Frontend:** React (functional components, hooks), React Router, Context API, Vite
- **Backend:** Node.js, Express
- **Auth:** bcryptjs (password hashing), jsonwebtoken (JWT)
- **Storage:** JSON files (see above)

## Project structure

```
mern-ecommerce/
  client/                 React frontend (Vite)
    src/
      components/         Navbar, ProductCard, CartItem, OrderSummary, ProtectedRoute
      context/            AuthContext, CartContext
      pages/              Home, ProductDetails, Cart, Login, Register, Checkout, Orders
      api.js              helper for calling the backend
  server/                 Express backend
    routes/               products, auth, orders
    middleware/           auth (JWT check)
    data/                 products.json (+ users.json, orders.json at runtime)
    db.js                 read/write JSON files
    index.js              server entry point
  .gitignore
  README.md
```

## Run it locally

You need **Node.js 20 or newer** and Git.

```bash
git clone https://github.com/Myowui/mern-ecommerce.git
cd mern-ecommerce
```

**1. Backend**

```bash
cd server
npm install
```

Create a file named `.env` inside `server/` with these variables (use your own long random text for the secret):

```
PORT=5001
JWT_SECRET=your-own-long-random-text
```

Start it:

```bash
npm run dev
```

**2. Frontend** (in a second terminal)

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**. In development, Vite forwards `/api` requests to the backend on port 5001.

**Optional: run it as one server, like in production**

```bash
cd client
npm run build
cd ../server
node index.js
```

Then open **http://localhost:5001**. When `client/dist` exists, the Express server serves the website and the API together.

## Environment variables

Only the **names** are listed here. Real values are never committed.

| Name | Required | Purpose |
|---|---|---|
| `JWT_SECRET` | Yes | Secret used to sign login tokens |
| `PORT` | No | Port for the server (default 5001; hosts like Render set it automatically) |

## API endpoints

| Method | Route | Login needed | What it does |
|---|---|---|---|
| GET | `/api/health` | No | Check that the server is running |
| GET | `/api/products` | No | List products (`?search=` and `?category=` filters) |
| GET | `/api/products/:id` | No | One product |
| POST | `/api/auth/register` | No | Create an account, returns a token |
| POST | `/api/auth/login` | No | Log in, returns a token |
| GET | `/api/auth/me` | Yes | Current user |
| POST | `/api/orders` | Yes | Place an order |
| GET | `/api/orders` | Yes | The logged-in user's orders |

## Deployment (Render)

One Render web service serves both the API and the website.

- **Build command:** `cd client && npm install --include=dev && npm run build && cd ../server && npm install`
- **Start command:** `node server/index.js`
- **Environment variables:** `JWT_SECRET`, `NODE_VERSION`
