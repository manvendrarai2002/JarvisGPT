# JarvisGPT 🤖

A full-stack AI application that combines conversational AI, image generation, authentication, usage credits, and Razorpay payments in one product.

## Engineering highlights

- Conversational AI integration through Google Gemini
- Text and image generation workflows
- JWT authentication and password hashing
- Credit-based usage model
- Razorpay order/payment integration
- Razorpay webhook signature verification
- MongoDB persistence with Mongoose
- React + Vite frontend
- Express API with configurable CORS and request limits
- API health endpoint

## Architecture

```text
React + Vite
     |
     | HTTP
     v
Express API
 |       |        |
 |       |        +--> Razorpay
 |       +-----------> Gemini / Image services
 +-------------------> MongoDB
```

## Tech stack

**Frontend:** React, Vite  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose  
**AI:** Google Gemini API  
**Payments:** Razorpay  
**Auth:** JWT, bcryptjs

## Project structure

```text
JarvisGPT/
├── client/              # React + Vite frontend
├── server/
│   ├── configs/         # Database/service configuration
│   ├── controllers/     # Request and business logic
│   ├── middlewares/     # Authentication middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── app.js
│   ├── server.js
│   └── .env.example
└── README.md
```

## Run locally

### Prerequisites

- Node.js 20+
- MongoDB local instance or MongoDB Atlas
- Gemini API credentials for AI features
- Razorpay credentials for payment features

### Clone

```bash
git clone https://github.com/manvendrarai2002/JarvisGPT.git
cd JarvisGPT
```

### Backend

```bash
cd server
npm install
cp .env.example .env
npm start
```

Configure the required variables in `server/.env`. Never commit real credentials.

### Frontend

In another terminal:

```bash
cd client
npm install
npm run dev
```

The Vite development server normally runs on `http://localhost:5173`.

## API

### Health check

```http
GET /api/health
```

Returns a small JSON response confirming that the API process is alive.

## Security notes

- Razorpay webhooks verify the signature against the exact raw request body.
- Payment verification is tied to the authenticated user's transaction.
- Payment signatures use timing-safe comparison.
- CORS is restricted to configured origins.
- Real secrets belong in environment variables, never source control.
- The API disables Express's `X-Powered-By` header and uses basic security headers.

## Screenshots

The repository contains screenshots demonstrating authentication, chat, credits, and payment flows.

## Roadmap

- Streaming AI responses
- Rate limiting and abuse protection
- Usage/token cost analytics
- Automated backend tests and CI
- Production observability
- Provider fallback/retry strategy

## Status

Portfolio project. The current focus is reliability, security, and production-readiness rather than adding more UI features.
