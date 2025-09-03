# ClyptGPT – AI-Powered Conversational Chatbot  
ClyptGPT is a **AI full-stack MERN and AI application** that delivers **conversational AI** using the **Gemini API**. It supports **text and image generation**, with a modern UI that adapts to **dark and light modes**. Users can track **credits** for AI usage, and generated images can be **publicly viewable**.  

## 🌐 Live URLs  

- **Frontend**: https://clypt-gpt.vercel.app 
- **Backend**: https://clypt-gpt-server.vercel.app

⚠️ **Note:** The backend must be running for the chatbot to function properly. It handles session management, text/image requests, and AI responses.  

## 🚀 Features  

- **Conversational AI** – ChatGPT-like assistant powered by Gemini API  
- **Text Generation** – AI-powered responses for Q&A, writing, and brainstorming  
- **Image Generation** – Create images from natural language prompts  
- **Dark & Light Mode** – Modern, responsive UI with theme toggle  
- **Credits System** – Usage-based credits for AI interactions  
- **Public Images** – Generated images can be made publicly available it can be viewed by all users  

## 🛠️ Tech Stack  

- **Frontend:** React + Vite  
- **Backend:** Node.js + Express.js  
- **AI Engine:** Gemini API  
- **Database:** MongoDB (for users, chat history, credits, and generated images)  
- **Hosting:** Vercel (frontend & backend)   

## 📦 How It Works  

1. **User Message/Prompt** → Sent from frontend to backend API  
2. **AI Processing** → Backend forwards request to Gemini (text or image)  
3. **Response/Output** → Gemini returns a reply or generated image  
4. **Delivery** → Response shown in chat, images stored & public images will be displayed in public community feed  
5. **Credits Deduction** → Each AI use deducts credits from the user’s account  
