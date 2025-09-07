# Jarvis GPT – Your Personal AI Conversational Chatbot

Welcome to **Jarvis GPT** 🎉  
A powerful full-stack **MERN application** that brings conversational AI to your fingertips, powered by the **Google Gemini API**.  

Jarvis is more than just a chatbot—it’s your **creative partner** capable of generating both text and images. The app also features a **credit system** and **Razorpay integration** for premium plans. The UI is sleek, modern, and supports both **dark and light themes**.  

---

## 🚀 Core Features

- 🤖 **Conversational AI** – Engage in natural, human-like conversations.  
- 🖼 **Text & Image Generation** – Create stunning images from simple prompts.  
- 💳 **Credit System** – Track and manage usage via credits.  
- 🎨 **Modern UI** – Clean, responsive design with dark/light mode toggle.  
- 💰 **Payments** – Integrated with **Razorpay** for secure transactions.  

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB (Atlas/local)  
- **AI Engine**: Google Gemini API  
- **Payments**: Razorpay  

---

## 📸 Screenshots

## 📸 Screenshots

| Login & Sign Up | Main Chat Interface |
| :---: | :---: |
| <img width="703" alt="Login and Sign Up pages" src="https://github.com/user-attachments/assets/87abc993-2a39-49eb-9340-1513c6b42112"> |<img width="610" height="382" alt="image" src="https://github.com/user-attachments/assets/096c5b55-6841-4563-836f-b8c23faed915" />

| Chat Demo | Credit Plans & Payment |
| :---: | :---: |
| <img width="611" alt="Chat conversation demo" src="https://github.com/user-attachments/assets/762a16cb-56f9-42ce-95bf-a68c541a6020"> | <img width="601" alt="Credit plans and payment modal" src="https://github.com/user-attachments/assets/853ca4e1-9e77-4dda-93aa-c17fa92e4988"> |

| Payment Confirmation |
| :---: |
| <img width="593" alt="Payment successful confirmation" src="https://github.com/user-attachments/assets/37057397-3418-4f45-8499-92c0a2a9d29f"> |



---

## 🏁 Getting Started: Run Locally  

### 1. Prerequisites  

Install the following:  
- [Node.js](https://nodejs.org)  
- [MongoDB](https://www.mongodb.com) (local or Atlas)  
- [Git](https://git-scm.com)  

### 2. Clone Repository  

```bash
git clone https://github.com/manvendrarai2002/manvendrarai2002.git
cd manvendrarai2002
```

### 3. Backend Setup  

```bash
cd server
npm install
```

Create a `.env` file inside `server/` with:

```env
MONGODB_URI="your_mongodb_connection_string_here"
JWT_SECRET="your_super_secret_jwt_key"
GEMINI_API_KEY="your_gemini_api_key_here"
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

Run backend:

```bash
npm start
```

If successful, you’ll see:  
```
Database connected
Server is running on port 3000
```

### 4. Frontend Setup  

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and connects to backend (port 3000) via proxy.

---

## 🎉 You’re All Set!  

Now open the app in your browser, **create an account**, and start chatting with **Jarvis GPT**.  

---

## ⚡ Future Improvements  

- 📱 Mobile App version (React Native)  
- 🌍 Multi-language support  
- 👥 Team/Workspace chats  
- 📊 Usage analytics dashboard  

---

🙏 Acknowledgement

The payment integration was inspired by an open-source project that used Stripe. I studied that implementation and then adapted the logic for Razorpay to suit my project’s needs.

