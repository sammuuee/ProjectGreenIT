<template>
    <div>
      <h2>Inscription</h2>
      <input v-model="username" type="text" placeholder="Nom d'utilisateur" />
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Mot de passe" />
      <button @click="register">Créer un compte</button>
      <p @click="$emit('go-login')" style="cursor: pointer; color: blue;">Déjà inscrit ? Se connecter</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: ''
      };
    },
    methods: {
      async register() {
        try {
          const response = await fetch('http://10.3.203.73:3000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: this.username,
              email: this.email,
              password: this.password
            })
          });
  
          const data = await response.json();
  
          if (response.ok) {
            alert('Inscription réussie ! Connectez-vous.');
            this.$emit('go-login');
          } else {
            alert(data.message || 'Erreur lors de l\'inscription');
          }
        } catch (err) {
          alert('Erreur serveur');
          console.error(err);
        }
      }
    }
  };
  </script>
  
  <style>
  input {
    display: block;
    margin: 10px 0;
    padding: 8px;
    width: 100%;
    max-width: 400px;
    color: black; /* couleur du texte */
    background-color: white; /* couleur du champ */
    border: 1px solid #ccc;
  }
  button {
    padding: 10px;
    margin-top: 10px;
    background-color: #42b983;
    color: white;
    border: none;
    cursor: pointer;
  }
  body {
  background-color: #121212; /* ou une autre couleur foncée si tu veux */
  color: white; /* couleur du texte global */
}
  </style>