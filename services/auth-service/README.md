# Auth Service - Tcent.AI

Complete authentication microservice with JWT, bcrypt, and MongoDB.

## 🎯 Features
- User Registration with validation
- User Login with JWT tokens
- Password hashing with bcrypt
- Protected routes with JWT middleware
- Role-based authorization ready
- Input validation with express-validator
- MongoDB with Mongoose ODM

## 📦 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file (already provided) and update:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_min_32_characters_long
```

**Get MongoDB URI:**
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy connection string and replace `<password>` with your password

### 3. Run the Service
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

Service will run on: http://localhost:3001

## 🔌 API Endpoints

### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "password": "secure123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Priya Sharma",
      "email": "priya@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "priya@example.com",
  "password": "secure123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Priya Sharma",
      "email": "priya@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Priya Sharma",
      "email": "priya@example.com",
      "role": "user",
      "createdAt": "2024-03-15T10:30:00.000Z"
    }
  }
}
```

### 4. Health Check
```http
GET /health
```

## 🧪 Testing with Postman/Thunder Client

### Test Registration
1. Method: POST
2. URL: http://localhost:3001/api/auth/register
3. Body (JSON):
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}
```

### Test Login
1. Method: POST
2. URL: http://localhost:3001/api/auth/login
3. Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "test123"
}
```
4. Copy the `token` from response

### Test Protected Route
1. Method: GET
2. URL: http://localhost:3001/api/auth/me
3. Headers:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`

## 🏗️ Project Structure Explained

```
auth-service/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection logic
│   ├── models/
│   │   └── User.js            # User schema + password hashing
│   ├── controllers/
│   │   └── auth.controller.js # Business logic (register, login, getMe)
│   ├── routes/
│   │   └── auth.routes.js     # API endpoints definition
│   ├── middleware/
│   │   └── auth.middleware.js # JWT verification
│   └── utils/
│       └── validators.js      # Input validation rules
├── .env                       # Environment variables (SECRET!)
├── server.js                  # Express app entry point
└── package.json               # Dependencies
```

## 🔑 Important Concepts

### 1. Password Hashing
- Never store plain text passwords
- `bcryptjs` creates one-way hash
- `userSchema.pre('save')` automatically hashes password before saving

### 2. JWT Token
- Token format: `header.payload.signature`
- Contains user ID in payload
- Signed with `JWT_SECRET` to prevent tampering
- Expires after 7 days (configurable)

### 3. Middleware Flow
```
Request → Validation → Controller → Response
          ↓
       (if /me route)
          ↓
     JWT Verification
```

### 4. Express Validator
- Checks input before reaching controller
- Returns 400 with error details if validation fails
- Example: email format, password length

## 🚨 Common Errors & Fixes

### Error: "User already exists"
- Email is already registered
- Try different email or use login

### Error: "Invalid email or password"
- Check credentials
- Password is case-sensitive

### Error: "Not authorized. Please login."
- Missing or invalid JWT token
- Login again to get new token

### Error: "Token expired"
- JWT expired after 7 days
- Login again to get new token

### Error: MongoDB connection failed
- Check `MONGODB_URI` in `.env`
- Verify network access in MongoDB Atlas
- Add your IP to whitelist

## 📚 Next Steps
- [ ] Integrate with frontend (React)
- [ ] Add password reset functionality
- [ ] Add email verification
- [ ] Add refresh tokens
- [ ] Add rate limiting

## 🎓 Interview Points
- Microservices architecture
- JWT authentication
- Password hashing with bcrypt
- MongoDB with Mongoose
- Input validation
- Error handling
- RESTful API design
