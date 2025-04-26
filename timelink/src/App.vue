<!-- src/App.vue -->
<template>
  <div class="container">
    <Login v-if="page === 'login'" @login-success="handleLogin" @go-register="page = 'register'" />
    <Register v-if="page === 'register'" @go-login="page = 'login'" />
    <Chat v-if="page === 'chat'" :user="user" @logout="logout" @go-friends="page = 'friends'" />
    <Friends v-if="page === 'friends'" :user="user" />
    <button v-if="user && page !== 'chat'" @click="page = 'chat'">Retour au chat</button>
  </div>
</template>

<script>
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Chat from './components/Chat.vue';
import Friends from './components/Friends.vue';

export default {
  components: { Login, Register, Chat, Friends },
  data() {
    return {
      page: 'login',
      user: null
    };
  },
  methods: {
    handleLogin(user) {
      this.user = user;
      this.page = 'chat';
    },
    logout() {
      this.user = null;
      this.page = 'login';
    }
  }
};
</script>

<style>
.container {
  max-width: 500px;
  margin: 50px auto;
  font-family: Arial;
  color: white;
}
</style>

