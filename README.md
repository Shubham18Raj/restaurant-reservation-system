# 🍽️ Restaurant Table Reservation System

A full-stack web application for online restaurant table booking.

**Domain:** Hospitality  
**Stack:** React 18 · Spring Boot 3 · JWT · MySQL 8

---

## 📁 Project Structure

```
restaurant-reservation/
├── backend/                  # Spring Boot application
│   ├── pom.xml
│   └── src/main/java/com/restaurant/
│       ├── RestaurantApplication.java
│       ├── config/           SecurityConfig.java
│       ├── controller/       AuthController, ReservationController,
│       │                     TableController, AdminController
│       ├── dto/              AuthDto, ReservationDto, TableDto
│       ├── entity/           User, RestaurantTable, Reservation
│       ├── repository/       UserRepository, TableRepository, ReservationRepository
│       ├── security/         JwtUtil, JwtAuthFilter
│       └── service/          AuthService, ReservationService,
│                             TableService, UserDetailsServiceImpl
└── frontend/                 # React application
    ├── package.json
    └── src/
        ├── App.js
        ├── context/          AuthContext.js
        ├── services/         api.js
        ├── styles/           global.css
        ├── components/
        │   └── common/       Navbar.js, ProtectedRoute.js
        └── pages/            Home, Login, Register,
                              BookTable, MyReservations, AdminDashboard
```

---

## ⚙️ Prerequisites

| Tool | Version |
|------|---------|
| Java JDK | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| MySQL | 8.0+ |

---

## 🚀 Getting Started

### 1. Database Setup

```sql
CREATE DATABASE restaurant_db;
```

### 2. Backend Setup

```bash
cd backend

# Edit DB credentials in:
# src/main/resources/application.properties
#   spring.datasource.username=root
#   spring.datasource.password=yourpassword

mvn clean install
mvn spring-boot:run
```

Backend runs at: **http://localhost:8080**  
Swagger UI: **http://localhost:8080/swagger-ui.html**

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🔐 Authentication & Roles

| Role | Permissions |
|------|------------|
| CUSTOMER | Register, login, book tables, view/cancel own reservations |
| MANAGER | All customer permissions + view all reservations, update status |
| ADMIN | All manager permissions + manage tables (add/edit/delete) |

JWT tokens are stored in localStorage and sent as `Authorization: Bearer <token>` header.

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### Tables
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tables` | List all tables |
| GET | `/api/tables/available?date=&startTime=&endTime=&guests=` | Available tables |

### Reservations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reservations` | Create reservation |
| GET | `/api/reservations/my` | My reservations |
| GET | `/api/reservations/{id}` | Get by ID |
| PUT | `/api/reservations/{id}` | Update reservation |
| DELETE | `/api/reservations/{id}` | Cancel reservation |

### Admin (MANAGER / ADMIN only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/reservations` | All reservations |
| PUT | `/api/admin/reservations/{id}` | Update status |
| POST | `/api/admin/tables` | Add table |
| PUT | `/api/admin/tables/{id}` | Update table |
| DELETE | `/api/admin/tables/{id}` | Delete table |

---

## 🗄️ Database Schema

```
users
  id, name, email, password, role, phone, created_at

restaurant_tables
  id, table_number, capacity, status, location, description

reservations
  id, user_id (FK), table_id (FK), reservation_date,
  start_time, end_time, guest_count, status,
  special_requests, created_at
```

---

## 📱 Frontend Pages

| Route | Page | Access |
|-------|------|--------|
| `/` | Home / Landing | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/book` | Book a Table | Logged in |
| `/my-reservations` | My Bookings | Logged in |
| `/admin` | Admin Dashboard | MANAGER / ADMIN |

---

## 🧪 Test Credentials (seed manually)

Insert an admin user via SQL after first run:

```sql
-- password is 'admin123' BCrypt encoded
INSERT INTO users (name, email, password, role, created_at)
VALUES (
  'Admin User',
  'admin@restaurant.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'ADMIN',
  NOW()
);
```

---

## 🏗️ Key Design Decisions

- **Stateless JWT auth** — no server-side sessions; tokens expire in 24h
- **CORS** configured for `localhost:3000` (update for production)
- **Role-based method security** via `@PreAuthorize` annotations
- **Conflict detection** — JPQL query prevents double-booking same table/slot
- **React Context** for global auth state, Axios interceptors for token injection
- **Proxy** in `package.json` forwards `/api` calls to Spring Boot during development
