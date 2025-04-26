<template>
    <div>
      <h2>Connexion</h2>
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Mot de passe" />
      <button @click="login">Se connecter</button>
      <p @click="$emit('go-register')" style="cursor: pointer; color: blue;">Pas de compte ? S'inscrire</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      async login() {
        try {
          const response = await fetch('http://10.3.203.73:3000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: this.email,
              password: this.password
            })
          });
  
          const data = await response.json();
  
          if (response.ok) {
            this.$emit('login-success', data.user);
          } else {
            alert(data.message || 'Identifiants invalides');
          }
        } catch (err) {
          alert('Erreur lors de la connexion au serveur');
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