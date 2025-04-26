const express = require('express');
const db = require('../database/db');
const router = express.Router();

router.post('/send', (req, res) => {
  const { sender_id, receiver_id, content } = req.body;
  db.query(
    'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
    [sender_id, receiver_id, content],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Message envoyé' });
    }
  );
});

router.get('/between/:user1/:user2', (req, res) => {
  const { user1, user2 } = req.params;
  db.query(
    `SELECT * FROM messages WHERE 
     (sender_id = ? AND receiver_id = ?) OR
     (sender_id = ? AND receiver_id = ?)
     ORDER BY sent_at ASC`,
    [user1, user2, user2, user1],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    }
  );
});

module.exports = router;
