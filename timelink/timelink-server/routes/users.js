const express = require('express');
const db = require('../database/db');
const router = express.Router();

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  db.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Utilisateur créé' });
    }
  );
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) return res.status(401).send({ message: 'Identifiants invalides' });
      res.send({ user: results[0] });
    }
  );
});

router.get('/by-username/:username', (req, res) => {
    const { username } = req.params;
    db.query('SELECT id FROM users WHERE username = ?', [username], (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length === 0) return res.status(404).send({ message: 'Utilisateur non trouvé' });
      res.send(result[0]); // { id: ... }
    });
});

router.get('/by-id/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT username FROM users WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send({ message: 'Utilisateur non trouvé' });
    res.send(result[0]); // { username: '...' }
  });
});
module.exports = router;