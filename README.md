# JarvisGPT 🤖

A full-stack AI application built with React, Node.js, Express and MongoDB. JarvisGPT combines conversational AI, image generation, usage credits and Razorpay payments in one web application.

## ✨ Features

- Conversational AI using the Google Gemini API
- Text and image generation flows
- Credit-based usage system
- Razorpay payment integration for premium plans
- JWT authentication
- Responsive React UI with dark/light themes

## 🧱 Architecture

```text
React + Vite
     │
     │ HTTP / API
     ▼
Node.js + Express
     │
     ├── MongoDB
     ├── Gemini API
     ├── Image generation provider
     └── Razorpay
```

## 🛠️ Tech Stack

**Frontend:** React, Vite  
**Backend:** Node.js, Express  
**Database:** MongoDB / Mongoose  
**AI:** Google Gemini API  
**Payments:** Razorpay  
**Authentication:** JWT, bcryptjs

## 📸 Screenshots

| Login / Sign Up | Chat Interface |
|---|---|
| ![Login](https://github.com/user-attachments/assets/87abc993-2a39-49eb-9340-1513c6b42112) | ![Chat](https://github.com/user-attachments/assets/096c5b55-6841-4563-836f-b8c23faed915) |

| Chat Demo | Credit Plans |
|---|---|
| ![Chat Demo](https://github.com/user-attachments/assets/762a16cb-56f9-42ce-95bf-a68c541a6020) | ![Credit Plans](https://github.com/user-attachments/assets/853ca4e1-9e77-4dda-93aa-c17fa92e4988) |

## 🚀 Run locally

### Prerequisites

- Node.js 18+
- MongoDB local instance or MongoDB Atlas
- Git

### Clone

```bash
git clone https://github.com/manvendrarai2002/JarvisGPT.git
cd JarvisGPT
```

### Backend

```bash
cd server
npm install
```

Create `server/.env` with the credentials required by the backend:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Never commit real credentials.

Start the server:

```bash
npm start
```

### Frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## 🔐 Engineering considerations

The project demonstrates several backend concerns beyond a basic chatbot: authentication, persistent user/credit state, third-party API integration and payment workflows. Future hardening should include automated tests for payment/webhook flows, rate limiting, structured logging, retries around external APIs and usage/cost observability.

## 📌 Project scope

JarvisGPT is a portfolio project demonstrating full-stack integration with AI and payment APIs. Production use would require additional operational and security hardening.
