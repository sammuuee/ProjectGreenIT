const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const duelRoutes = require('./routes/duels');
const friendsRoutes = require('./routes/friends');

const app = express();

// CORS configuration
app.use(cors({
  origin: 'https://project-green-it.vercel.app',
  credentials: true
}));

app.use(express.json());

// routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/duels', duelRoutes);
app.use('/api/friends', friendsRoutes);

// server
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
});