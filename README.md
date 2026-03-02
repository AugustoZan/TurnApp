<img width="1366" height="603" alt="image" src="https://github.com/user-attachments/assets/fc0bf9d8-b75e-4db6-98a3-5e9b58df1c92" /># TurnApp 📅

A fullstack appointment booking web application with bilingual support (Spanish/English).

<img width="1366" height="603" alt="image" src="https://github.com/user-attachments/assets/89262bd8-4930-4739-b4a8-830b39078d8e" />
<img width="1366" height="603" alt="image" src="https://github.com/user-attachments/assets/5eecc7e2-14b2-4a97-a8b4-ffe15eab2783" />

## 🚀 Features

- User registration and login with JWT authentication
- Role-based access control (client / admin)
- Interactive calendar powered by FullCalendar
- Book and cancel appointments in real time
- Admin panel to create time slots and view all bookings
- Bilingual support (ES/EN) with flag toggle
- Responsive design for mobile and desktop
- Rate limiting and security headers with Helmet.js
- SQL injection protection with parameterized queries

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- FullCalendar v6

**Backend:**
- Node.js
- Express.js
- JWT (jsonwebtoken)
- bcryptjs
- Helmet.js
- express-rate-limit

**Database:**
- MySQL

## 📸 Screenshots

### Login
<img width="1366" height="603" alt="image" src="https://github.com/user-attachments/assets/89262bd8-4930-4739-b4a8-830b39078d8e" />
<img width="1366" height="603" alt="image" src="https://github.com/user-attachments/assets/5eecc7e2-14b2-4a97-a8b4-ffe15eab2783" />

### Dashboard
<img width="1366" height="601" alt="image" src="https://github.com/user-attachments/assets/270c5512-b71c-48a9-a9e6-cf18359eeeda" />
<img width="1366" height="603" alt="image" src="https://github.com/user-attachments/assets/25a4551e-811a-4e5d-9d79-da97a915bd94" />


### Admin Panel
<img width="1366" height="603" alt="image" src="https://github.com/user-attachments/assets/e1443980-a207-4c5e-9cd7-67531e558da9" />
<img width="1366" height="605" alt="image" src="https://github.com/user-attachments/assets/d8317cc4-046f-4d3c-ba33-6e146655d5ef" />


## ⚙️ Running Locally

### Prerequisites
- Node.js
- MySQL

### 1. Clone the repository
```bash
git clone https://github.com/AugustoZan/TurnApp.git
cd TurnApp
```

### 2. Set up the database
Run the SQL script in MySQL:
```bash
mysql -u root -p < database/turnapp_db.sql
```

### 3. Configure environment variables
```bash
cd backend
cp .env.example .env
```
Edit `.env` with your MySQL credentials.

### 4. Install dependencies and start the server
```bash
npm install
node server.js
```

### 5. Open the frontend
Open `frontend/public/index.html` with Live Server or any static file server.

## 🔐 Demo
| Role | Email | Password |
|------|-------|----------|
| Client | demo@turnapp.com | demo123 |
| Admin | admin@turnapp.com | password |

## 📄 License
MIT
