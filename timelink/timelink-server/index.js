const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const duelRoutes = require('./routes/duels');
const friendsRoutes = require('./routes/friends');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/duels', duelRoutes);


app.use('/api/friends', friendsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
});