const express = require('express');
const db = require('../database/db');
const router = express.Router();

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send({ message: "Tous les champs sont requis." });
  }

  db.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password],
    (err, result) => {
      if (err) {
        console.error('Erreur pendant l\'inscription :', err); // 🔥 Important pour Render
        return res.status(500).send({ message: "Erreur serveur pendant l'inscription", error: err });
      }
      res.send({ message: 'Utilisateur créé', userId: result.insertId });
    }
  );
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Email et mot de passe requis." });
  }

  db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error('Erreur pendant le login :', err); // 🔥
        return res.status(500).send({ message: "Erreur serveur pendant le login", error: err });
      }
      if (results.length === 0) {
        return res.status(401).send({ message: 'Identifiants invalides' });
      }
      res.send({ user: results[0] });
    }
  );
});

router.get('/by-username/:username', (req, res) => {
  const { username } = req.params;
  db.query('SELECT id FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      console.error('Erreur recherche par username :', err); // 🔥
      return res.status(500).send({ message: "Erreur serveur", error: err });
    }
    if (result.length === 0) return res.status(404).send({ message: 'Utilisateur non trouvé' });
    res.send(result[0]);
  });
});

router.get('/by-id/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT username FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Erreur recherche par ID :', err); // 🔥
      return res.status(500).send({ message: "Erreur serveur", error: err });
    }
    if (result.length === 0) return res.status(404).send({ message: 'Utilisateur non trouvé' });
    res.send(result[0]);
  });
});

module.exports = router;