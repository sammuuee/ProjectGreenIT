const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const duelRoutes = require('./routes/duels');
const friendsRoutes = require('./routes/friends');
const cron = require('node-cron');
const app = express();
const db = require('./database/db');
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
cron.schedule('0 * * * *', () => {
  console.log('⏰ Nettoyage des messages anciens...');

  const query = `
    DELETE FROM messages
    WHERE created_at < NOW() - INTERVAL 24 HOUR
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Erreur lors du nettoyage des messages :', err);
    } else {
      console.log(`✅ Messages supprimés : ${result.affectedRows}`);
    }
  });
});
// server
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
});