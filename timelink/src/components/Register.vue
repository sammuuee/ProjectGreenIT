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
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      serverUrl: import.meta.env.VITE_API_URL
    };
  },
  methods: {
    async register() {
      try {
        console.log("URL API utilisée :", this.serverUrl);
        const response = await axios.post(`${this.serverUrl}/api/users/register`, {
          username: this.username,
          email: this.email,
          password: this.password
          
        });

        alert('Inscription réussie ! Connectez-vous.');
        this.$emit('go-login');
      } catch (err) {
        if (err.response) {
          alert(err.response.data.message || 'Erreur lors de l\'inscription');
        } else {
          alert('Erreur serveur');
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