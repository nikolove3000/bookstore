# The Liminal Shelf

> *Where stories linger between worlds.*

A full-stack online bookstore built with Spring Boot and React, featuring a gothic-inspired editorial design system, a complete e-commerce flow, and an administrative dashboard for catalog and order management.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Overview](#api-overview)
- [Roles & Permissions](#roles--permissions)
- [Design System](#design-system)
- [Known Limitations](#known-limitations)

---

## Overview

The Liminal Shelf is a complete bookstore platform covering the full lifecycle of an e-commerce catalog: browsing and searching books, cart management, checkout, order history, reviews tied to verified purchases, and a dedicated admin dashboard for operational management.

The backend is a REST API built on Spring Boot with JWT-based authentication, and the frontend is a single-page React application that consumes it. Both layers share a consistent visual identity — a dark, literary aesthetic inspired by antiquarian bookshops.

---

## Tech Stack

**Backend**
- Java 21
- Spring Boot 4.0.4
- Spring Data JPA (Hibernate)
- Spring Security + JWT (access token + refresh token rotation)
- PostgreSQL
- Maven

**Frontend**
- React 18 + Vite
- React Router DOM
- Axios
- Tailwind CSS (utility styling) + custom CSS design system

---

## Features

### Public
- Book catalog with filtering (category, price range, keyword search), sorting, and pagination
- Book detail pages with related titles and reader reviews
- Category browsing

### Authenticated Users
- Registration, login, logout, and session persistence (JWT + HttpOnly refresh cookie)
- Shopping cart — add, update quantity, remove, with live stock validation
- Checkout and order placement
- Order history and order detail, with self-service cancellation while an order is still pending
- Reviews — verified-purchase only, one review per book per user, editable and deletable
- Wishlist — save and remove titles for later
- Profile management — update personal details, change password

### Admin
- **Order management** — view all orders, filter by status, advance order status through its lifecycle
- **Book management** — create, edit, and delete catalog entries, including cover image upload, and inline quick-creation of authors, publishers, and categories directly from the book form
- **User management** — view all accounts and change user roles, with safeguards against self-demotion and removing the last remaining administrator

---

## Project Structure

```
bookstore/
├── src/main/java/com/thanh/bookstore/
│   ├── entity/            JPA entities
│   ├── repository/        Spring Data repositories
│   ├── dto/                Request/response payloads
│   ├── service/            Business logic
│   ├── controller/         REST endpoints
│   ├── security/           JWT filter, Spring Security config
│   ├── exception/          Custom exceptions + global handler
│   ├── specification/      Dynamic JPA query specifications
│   └── config/              Application-level configuration (file storage, etc.)
├── uploads/                 Locally stored book cover images (gitignored)
│
└── bookstore-fe/
    └── src/
        ├── api/             Axios clients per resource
        ├── component/       Shared UI components (Navbar, Footer, ShelfBook, auth forms)
        ├── context/         React context (Auth, Cart)
        ├── page/            Route-level pages
        └── App.jsx          Routing and layout composition
```

---

## Database Schema

The application is backed by a normalized PostgreSQL schema:

`users` · `authors` · `publishers` · `categories` · `books` · `book_categories` · `price_history` · `orders` · `order_items` · `carts` · `cart_items` · `reviews` · `wishlists` · `refresh_tokens` · `token_blacklist`

Key relationships:
- A book belongs to one author and one publisher, and many categories (many-to-many).
- Orders snapshot unit prices at time of purchase, independent of later catalog price changes.
- Reviews require the reviewing user to hold a non-cancelled order containing the book.

Hibernate is configured with `ddl-auto=update`, so the schema is created and evolved automatically on application startup.

---

## Getting Started

### Prerequisites

- JDK 21
- Maven (or use the included `./mvnw` wrapper)
- Node.js 18+ and npm
- PostgreSQL 14+

### Backend Setup

1. **Create the database:**

   ```sql
   CREATE DATABASE bookstore;
   ```

2. **Configure `src/main/resources/application.properties`:**

   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/bookstore
   spring.datasource.username=your_username
   spring.datasource.password=your_password

   jwt.secret=a_base64_encoded_secret_key
   jwt.expiration=86400000

   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
   ```

   > `application.properties` is gitignored, as it contains credentials. Use the values above as a template.

3. **Run the application:**

   ```bash
   ./mvnw spring-boot:run
   ```

   The API will be available at `http://localhost:8080`.

4. **Create your first account, then promote it to admin:**

   ```bash
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","email":"admin@example.com","password":"YourPassword1@","fullName":"Admin"}'
   ```

   ```sql
   UPDATE users SET role = 'ADMIN' WHERE username = 'admin';
   ```

   Log in again after the role change to receive a token carrying the updated role.

### Frontend Setup

1. **Install dependencies:**

   ```bash
   cd bookstore-fe
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`.

   The frontend expects the backend to be running at `http://localhost:8080`; adjust `axiosClient.js` if your backend runs elsewhere.

---

## API Overview

All endpoints are prefixed with `/api`. A representative sample:

| Resource | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout` |
| Books | `GET /books`, `GET /books/{id}`, `GET /books/search`, `GET /books/featured`, `GET /books/new-arrivals` |
| Cart | `GET /cart`, `POST /cart/items`, `PUT /cart/items/{id}`, `DELETE /cart/items/{id}` |
| Orders | `POST /orders/checkout`, `GET /orders`, `GET /orders/{id}`, `POST /orders/{id}/cancel` |
| Reviews | `POST /books/{bookId}/reviews`, `PUT /reviews/{id}`, `DELETE /reviews/{id}` |
| Wishlist | `GET /wishlist`, `POST /wishlist/{bookId}`, `DELETE /wishlist/{bookId}` |
| Profile | `GET /users/me`, `PUT /users/me`, `PUT /users/me/password` |
| Admin | `GET /admin/orders`, `PATCH /admin/orders/{id}/status`, `POST/PUT/DELETE /admin/books/{id}`, `GET /admin/users`, `PATCH /admin/users/{id}/role` |

Errors are returned as a consistent JSON shape:

```json
{
  "status": 404,
  "error": "RESOURCE_NOT_FOUND",
  "message": "Book not found: 42",
  "timestamp": "2026-07-09T10:00:00"
}
```

---

## Roles & Permissions

| Role | Access |
|---|---|
| `USER` | Browsing, cart, checkout, orders, reviews, wishlist, profile |
| `ADMIN` | Everything a `USER` can do, plus catalog management, order status management, and user role management |

Role-change safeguards prevent an administrator from altering their own role or demoting the last remaining admin account, ensuring the system never loses administrative access.

---

## Design System

The interface follows a consistent gothic-editorial identity across every page:

- **Typography** — Georgia, serif throughout
- **Palette** — deep charcoal backgrounds (`#0d0b0b`, `#0F1720`), antique gold accents (`#c9a84c`), muted red-oxide call-to-action elements (`#1a0808` / `#8b2020` / `#c0392b`)
- **Ornamentation** — hairline `0.5px` borders, `✦` corner marks, `◆` divider gems
- **Motif** — vertical rules labeled *Bibliotheca* and *Noctis* frame the hero section, reinforcing the "threshold between worlds" concept

---

## Known Limitations

- Payment is not integrated; orders are marked as paid at the point of checkout.
- Uploaded cover images are stored on local disk (`uploads/`), which is not persistent across deployments to platforms with ephemeral filesystems.
- No automated test suite is currently included.
- The interface is optimized for desktop; mobile responsiveness has not been fully audited.

---

## License

This project was built as a learning exercise and portfolio piece. No license has been formally assigned.