# FileShare – Referral & Credit System

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

**A Full-Stack Referral & Credit Management Platform with Clean Architecture**

## 🎨 Color Palette

```css
Primary Blue:    #3674B5
Secondary Blue:  #578FCA
Accent Blue:     #A1E3F9
Mint Light:      #D1F8EF
Dark Navy:       #0D1164
Background:      #FFFFE3
Gradient:        linear-gradient(135deg, #3674B5, #578FCA, #A1E3F9)
```

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Business Logic](#-business-logic)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)

---

## 🎯 Project Overview

**FileShare** is a production-ready, full-stack application implementing a complete referral and credit system. Users can:

- ✅ Register and login securely with JWT authentication
- ✅ Generate unique referral links automatically
- ✅ Earn credits when referred users make their first purchase
- ✅ Track referral activity through a comprehensive dashboard
- ✅ View detailed analytics and conversion metrics
- ✅ Browse and purchase products with multiple payment options
- ✅ View purchase history and transaction details

### Architecture Highlights


**Key Design Decisions:**
1. **Centralized Routing**: All backend routes in `api/v2/route.ts`
2. **Centralized API Config**: All frontend API calls through `src/api/agent.ts`
3. **Feature-based Structure**: Organized by domain (Auth, Referral, Purchase, Dashboard)
4. **Separation of Concerns**: Endpoints handle HTTP, helpers handle business logic

---

## 🚀 Key Features

### 🔐 Authentication & Security
- JWT-based authentication with secure password hashing
- Protected routes and middleware validation
- Automatic referral code generation for new users

### 👥 Referral System
- Unique referral links for each user
- Multi-level referral tracking (referrer → referred user)
- Credit distribution on first purchase only
- Prevention of duplicate crediting

### 💰 Credit Management
- Configurable credit amounts for referrers and referred users
- Real-time credit balance tracking
- Credit history and transaction logs

### 📊 Dashboard Analytics
- Total referred users count
- Successful conversion metrics
- Credit earnings summary
- Referral link sharing

### 🛒 E-commerce Features
- Product catalog with filtering (All, Popular, New, Sale)
- Shopping cart with quantity management
- Multiple payment methods (UPI, Card, PayPal, EMI, COD)
- Purchase history tracking
- Wishlist functionality

### 🎨 User Experience
- Responsive design with Tailwind CSS
- Dark mode support
- Smooth animations and transitions
- Mobile-first approach
- Toast notifications for user feedback

---

## 🏗️ Architecture

### Backend Architecture (Express.js + TypeScript)

```
backend/
├── src/
│   ├── api/v2/route.ts          # Main API router (all endpoints)
│   ├── helper/v2/               # Business logic helpers
│   │   ├── authHelper.ts        # Authentication logic
│   │   ├── referralHelper.ts    # Referral processing
│   │   ├── purchaseHelper.ts    # Purchase & credit logic
│   │   └── dashboardHelper.ts   # Analytics & stats
│   ├── models/                  # MongoDB schemas
│   │   ├── User.ts             # User model
│   │   ├── Referral.ts         # Referral relationships
│   │   └── Purchase.ts         # Purchase transactions
│   ├── middleware/             # Express middleware
│   └── config/                 # Database & app config
└── dist/                       # Compiled JavaScript
```

### Frontend Architecture (Next.js 14 + TypeScript)

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Authentication pages
│   │   ├── dashboard/          # User dashboard
│   │   ├── products/           # Product catalog
│   │   ├── cart/              # Shopping cart
│   │   ├── payment/           # Payment processing
│   │   └── history/           # Purchase history
│   ├── components/            # Reusable UI components
│   ├── context/               # React Context providers
│   ├── redux/                 # Redux Toolkit slices
│   └── api/                   # API configuration
└── public/                    # Static assets
```

### Data Flow Architecture

1. **User Registration**: User signs up → Referral code generated → JWT token issued
2. **Referral Process**: User shares link → New user registers with referral code → Referral relationship created
3. **Purchase Flow**: User adds to cart → Selects payment method → Purchase created → Credits distributed
4. **Credit Distribution**: First purchase triggers → Referral status updated → Credits awarded to both users

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js ≥ 18.x
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Express-validator middleware
- **CORS**: Configurable cross-origin resource sharing

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Redux Toolkit Query + React Context
- **UI Components**: Custom components with Tailwind
- **Icons**: React Icons + Heroicons
- **Notifications**: React Hot Toast

### Development Tools
- **Build Tools**: TypeScript compiler, Next.js build system
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier
- **Package Management**: npm
- **Version Control**: Git

---

## 📁 Project Structure

```
FileShare/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── api/v2/route.ts     # All API endpoints
│   │   ├── helper/v2/          # Business logic
│   │   ├── models/             # MongoDB schemas
│   │   ├── middleware/         # Express middleware
│   │   └── config/             # App configuration
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # Next.js application
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   ├── components/         # UI components
│   │   ├── context/            # React contexts
│   │   ├── redux/              # Redux slices
│   │   └── api/                # API client
│   ├── package.json
│   └── tailwind.config.js
├── PROJECT.md                  # Project requirements
└── README.md                   # This file
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js ≥ 18.x
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager
- Git

### Backend Setup

```bash
# Clone the repository
git clone <repository-url>
cd FileShare/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# See Environment Variables section below
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your configuration
# See Environment Variables section below
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/FileShare
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/FileShare

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Credit System Configuration
REFERRAL_CREDIT_AMOUNT=2
REFERRED_CREDIT_AMOUNT=2

# Frontend URL (for email links, etc.)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_VERSION=v2

# Application
NEXT_PUBLIC_APP_NAME=FileShare

# Optional: Analytics, etc.
# NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

---

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend server starts on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend application starts on `http://localhost:3000`

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

**Frontend:**
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run Next.js linting
- `npm run format` - Format code with Prettier

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api/v2
```

### Authentication Endpoints

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "referralCode": "ABC123" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "referralCode": "XYZ789",
      "credits": 0
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/auth/login`
Authenticate user login.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/auth/me`
Get current user profile (requires authentication).

### Referral Endpoints

#### GET `/referral/stats`
Get user's referral statistics.

#### POST `/referral/process`
Process referral credit distribution (internal use).

### Purchase Endpoints

#### POST `/purchase/create`
Create a new purchase and distribute credits.

**Request Body:**
```json
{
  "productId": "1",
  "productName": "Premium Package",
  "amount": 299
}
```

#### GET `/purchase/history`
Get user's purchase history.

### Dashboard Endpoints

#### GET `/dashboard/stats`
Get comprehensive dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalReferrals": 5,
    "successfulReferrals": 3,
    "totalCredits": 6,
    "referralCode": "ABC123"
  }
}
```

---

## 💼 Business Logic

### Referral System Logic

1. **User Registration with Referral:**
   - New user provides referral code during registration
   - System validates referral code exists
   - Creates referral relationship: referrer ↔ referred user
   - Sets referral status to "pending"

2. **Credit Distribution:**
   - Triggered when referred user makes their **first purchase**
   - Updates referral status to "converted"
   - Awards credits to both users:
     - Referrer: `REFERRAL_CREDIT_AMOUNT` (default: 2)
     - Referred user: `REFERRED_CREDIT_AMOUNT` (default: 2)
   - Sets `credited: true` to prevent duplicate crediting

3. **Purchase Processing:**
   - Checks if this is user's first purchase
   - If first purchase and has referrer:
     - Distributes credits to both parties
     - Updates referral status
   - Records purchase transaction

### Security Measures

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure authentication with expiration
- **Input Validation**: Comprehensive validation on all endpoints
- **CORS Protection**: Configured allowed origins
- **Rate Limiting**: (Can be added with express-rate-limit)

### Data Integrity

- **Unique Constraints**: Email and referral codes
- **Referential Integrity**: Foreign key relationships
- **Transaction Safety**: Atomic operations for credit distribution
- **Audit Trail**: Complete purchase and credit history

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required, 2-50 chars),
  email: String (required, unique, email format),
  passwordHash: String (required, min 6 chars, not selected),
  referralCode: String (unique, uppercase, auto-generated),
  credits: Number (default: 0, min: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Referral Collection
```javascript
{
  _id: ObjectId,
  referrerId: ObjectId (ref: User, required),
  referredId: ObjectId (ref: User, required),
  status: String (enum: ['pending', 'converted'], default: 'pending'),
  credited: Boolean (default: false),
  conversionDate: Date (null by default),
  createdAt: Date,
  updatedAt: Date
}
```

### Purchase Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  productId: String (required),
  productName: String (required),
  amount: Number (required, min: 0),
  firstPurchase: Boolean (default: false),
  purchaseDate: Date (default: now),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create Render Account**: Sign up at render.com
2. **Connect Repository**: Link your GitHub repository
3. **Configure Service**:
   - **Runtime**: Node.js
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: Copy from `.env`
4. **Database**: Use MongoDB Atlas for production
5. **Deploy**: Push to main branch or manual deploy

### Frontend Deployment (Vercel)

1. **Create Vercel Account**: Sign up at vercel.com
2. **Connect Repository**: Link your GitHub repository
3. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. **Environment Variables**: Add frontend environment variables
5. **Deploy**: Automatic on push to main branch

### Environment Setup

**Production Environment Variables:**

```env
# Backend (Render)
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/FileShare
JWT_SECRET=your_production_jwt_secret
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Frontend (Vercel)
NEXT_PUBLIC_API_URL=https://your-backend-api.render.com
NEXT_PUBLIC_API_VERSION=v2
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] CORS origins updated
- [ ] JWT secrets regenerated
- [ ] Build commands verified
- [ ] Domain configured (optional)
- [ ] SSL certificates (automatic on Render/Vercel)

---

## 🔧 Development Guidelines

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured for code quality
- **Prettier**: Consistent code formatting
- **Git Hooks**: Pre-commit linting (optional)

### Testing
- **Unit Tests**: Helper functions and utilities
- **Integration Tests**: API endpoints
- **E2E Tests**: User workflows (optional)

### Performance
- **Database Indexing**: Optimized queries
- **Caching**: Response caching where appropriate
- **Compression**: Gzip compression enabled
- **Bundle Optimization**: Next.js automatic optimization

### Security Best Practices
- **Input Sanitization**: All user inputs validated
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Protection**: React automatic escaping
- **CSRF Protection**: JWT stateless authentication
- **Rate Limiting**: Implement as needed

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Format
```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Express.js** for the robust Node.js framework
- **MongoDB** for the flexible NoSQL database
- **Tailwind CSS** for the utility-first CSS framework
- **Redux Toolkit** for state management
- **Heroicons** for beautiful icons

---

## 🛠️ Tech Stack

**Frontend:** Next.js 14, TypeScript, Redux Toolkit, RTK Query, Tailwind CSS, Framer Motion  
**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt  
**Architecture:** Clean Architecture, Feature-based, Centralized routing & API config

---
