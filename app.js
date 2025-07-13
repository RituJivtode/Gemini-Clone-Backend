// File: /src/app.js

const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatroomRoutes = require('./routes/chatroomRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
// const { errorHandler } = require('./middlewares/error.middleware');
const { verifyToken } = require('./utils/jwt');
const { initializeDatabase } = require('./models/index');

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/user', verifyToken, userRoutes);
app.use('/chatroom', verifyToken, chatroomRoutes);
app.use('/subscription', verifyToken, subscriptionRoutes);

// Error handler
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);
initializeDatabase();
});
