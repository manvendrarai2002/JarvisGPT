# Jarvis GPT – Your Personal AI Conversational Chatbot

Welcome to Jarvis GPT! This is a powerful, full-stack MERN application that brings a conversational AI to your fingertips, powered by the Gemini API. It's designed to be more than just a chatbot—it's a creative partner that can generate both text and images. The interface is sleek, modern, and includes both dark and light modes to suit your preference.

## 🚀 Core Features

- **Conversational AI**: Engage in natural, human-like conversations for everything from answering questions to brainstorming ideas.
- **Text & Image Generation**: Go beyond words and create stunning images from simple text prompts.
- **Credit System**: A built-in usage-based credit system to manage AI interactions.
- **Modern UI**: A clean, responsive interface with a beautiful theme toggle for dark and light modes.

## �️ Technology Powering Jarvis GPT

- **Frontend**: **React** (with Vite for a lightning-fast development experience)
- **Backend**: **Node.js** & **Express.js**
- **Database**: **MongoDB** (to store user data, chat history, credits, and images)
- **AI Engine**: **Google's Gemini API**

---

## 🏁 Getting Started: Setting Up Your Local Environment

Follow these steps to get Jarvis GPT running on your own machine.

### 1. Prerequisites

Make sure you have the following installed:
- **Node.js**: The runtime for our JavaScript code. You can download it from [nodejs.org](https://nodejs.org/).
- **MongoDB**: A database to store all your application data. You can use a local installation or a cloud service like MongoDB Atlas.
- **Git**: For cloning the repository.

### 2. Clone the Repository

First, grab the code from GitHub by running this command in your terminal:
```bash
git clone https://github.com/manvendrarai2002/manvendrarai2002.git
cd manvendrarai2002
```

### 3. Backend Setup (The Server)

The backend is the brain of the operation. It handles user authentication, connects to the database, and communicates with the Gemini AI.

**a. Navigate to the server directory and install dependencies:**
```bash
cd server
npm install
```

**b. Create your environment file:**
Create a new file named `.env` in the `server` directory. This is where you'll store all your secret keys and configuration variables.

**c. Add the following variables to your `.env` file:**
```env
# Your MongoDB connection string
MONGODB_URI="your_mongodb_connection_string_here"

# A secret key for creating JSON Web Tokens (JWT) for authentication
# You can generate a strong one here: https://www.grc.com/passwords.htm
JWT_SECRET="your_super_secret_jwt_key"

# Your Google Gemini API Key for AI text generation
GEMINI_API_KEY="your_gemini_api_key_here"

# Your Razorpay API keys for the payment system
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

**d. Start the backend server:**
```bash
npm start
```
If everything is configured correctly, you'll see a message in the terminal: `Database connected` and `Server is running on port 3000`.

### 4. Frontend Setup (The Client)

The frontend is the beautiful interface you'll interact with.

**a. Open a new terminal window.** Navigate to the `client` directory from the project's root folder and install its dependencies:
```bash
cd client
npm install
```

**b. Start the frontend development server:**
```bash
npm run dev
```
This will launch the React application. The terminal will give you a local URL to open in your browser, usually `http://localhost:5173`.

The frontend is already configured to talk to the backend (running on port 3000) via a proxy, so you don't need to configure any additional URLs for local development.

### You're All Set!

Your Jarvis GPT application should now be running locally. Open the URL from the frontend terminal in your browser, create an account, and start chatting with your AI!
