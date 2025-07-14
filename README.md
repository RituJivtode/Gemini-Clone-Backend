#### Gemini Backend Clone — Documentation ####

# Overview
A Gemini-style backend system that supports:
User login via OTP
User-specific chatrooms
Async Gemini-powered conversations
Stripe-based subscription system

# Architecture Overview
├── controllers/
├── routes/
├── models/
├── services/
├── queues/
├── middlewares/
├── utils/
├── cache/
└── app.js

Separation of concerns: routing, services, business logic, and error handling are modular.
Queue: separates prompt-response from request lifecycle (non-blocking).

# Gemini Queue System
All chat messages go into gemini-message BullMQ queue.
Worker (geminiWorker.js) calls Gemini API asynchronously.
Result is saved to Message.response once available.

# Gemini API Integration
Endpoint used:
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=API_KEY
No Authorization header — uses API key in URL.
Response is parsed and stored in DB:
{
  "contents": [
    {
      "parts": [{ "text": "Prompt here" }]
    }
  ]
}

# JWT Auth & Middleware
Token passed as:
Authorization: Bearer <token>
Middleware:
verifyToken: for protected routes

# Caching Justification
Used on:
GET /chatroom
Chatrooms are read frequently but change infrequently.
Redis caching with TTL = 5 min.
Reduces DB load significantly on dashboard load.

# Postman Collection
Organized into folders:
Auth, User, Chatroom, Subscription
JWT tokens included for protected routes
collection link: https://universal-crescent-267015.postman.co/workspace/My-Workspace~99de540b-5f94-4633-8594-223760965ba6/collection/20491503-3320379e-85e2-49ce-b81b-a61208bc1aba?action=share&source=copy-link&creator=20491503

# Deployment
Hosted on: EC2
Public URL: http://13.204.65.134:5000/
Ensure:
*Webhook URL registered with Stripe (Not applicable here as we are using Stripe CLI to test the webhook, to install strip CLI use this link: https://docs.stripe.com/stripe-cli?install-method=windows)
*Environment variables are set correctly

# How to Test via Postman
/auth/send-otp → get OTP
/auth/verify-otp → get token
Use token for protected routes
Create chatroom → send message
Start Pro subscription → get Stripe URL

# Setup Instruction
git clone https://github.com/RituJivtode/Gemini-Clone-Backend.git
cd Gemini-Clone-Backend
npm install
create .env manually and paste the data from .env file attached in email
npx sequelize db:migrate
node app.js

# Design Decisions
Used BullMQ for clean async flow
Redis used for both rate-limit and caching
Stripe metadata maps userId to subscription
