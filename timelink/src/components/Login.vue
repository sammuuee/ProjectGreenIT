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
import axios from 'axios';

export default {
data() {
  return {
    email: '',
    password: '',
    serverUrl: import.meta.env.VITE_API_URL
  };
},
methods: {
  async login() {
    try {
      const response = await axios.post(`${this.serverUrl}/api/users/login`, {
        email: this.email,
        password: this.password
      });

      const data = response.data;

      this.$emit('login-success', data.user);
    } catch (err) {
      if (err.response) {
        // Serveur a répondu avec une erreur
        alert(err.response.data.message || 'Identifiants invalides');
      } else {
        // Erreur réseau
        alert('Erreur lors de la connexion au serveur');
      }
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
color: black;
background-color: white;
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
background-color: #121212;
color: white;
}
</style>