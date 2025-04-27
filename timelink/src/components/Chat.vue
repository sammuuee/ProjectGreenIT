<template>
  <div class="chat-container">
    <template v-if="page === 'chat'">
      <h2>Bienvenue {{ user.username }}</h2>
      <button @click="$emit('go-friends')"> Ajouter des amis</button>

      <h3>Mes amis</h3>
      <ul>
        <li v-for="a in friends" :key="a.id">
          <button @click="startConversationWith(a.username)">
            💬 {{ a.username }}
          </button>
          <button @click="startPenalty(a.id)">
            ⚔️ Duel (Penalty)
          </button>
        </li>
      </ul>

      <div class="chat-box">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="message"
          :class="{ self: msg.sender_id === user.id, other: msg.sender_id !== user.id }"
        >
          {{ msg.content }}
        </div>
      </div>

      <input v-model="newMessage" placeholder="Écrire un message..." @keyup.enter="sendMessageToUser" />
      <button @click="sendMessageToUser">Envoyer</button>

      <br /><br />
      <button @click="$emit('logout')">Déconnexion</button>
    </template>

    <template v-else-if="page === 'penalty'">
      <PenaltyGame
        :user="user"
        :friendId="currentFriendId"
        :serverUrl="serverUrl"
        @back="page = 'chat'"
      />
    </template>
  </div>
</template>

<script>
import PenaltyGame from './PenaltyGame.vue';
import axios from 'axios';

export default {
  components: { PenaltyGame },
  props: ['user'],
  data() {
    return {
      serverUrl: import.meta.env.VITE_API_URL,
      friends: [],
      messages: [],
      newMessage: '',
      receiverUsername: '',
      receiverId: null,
      polling: null,
      page: 'chat', // <-- important
      currentFriendId: null
    };
  },
  mounted() {
    this.fetchFriends();
    this.polling = setInterval(() => {
      if (this.receiverId) this.loadConversation();
    }, 2000);
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
  methods: {
    async fetchFriends() { /* ton code fetch friends ici */ },
    async loadConversation() { /* ton code load conversation ici */ },
    async sendMessageToUser() { /* ton code envoyer message ici */ },
    startConversationWith(username) {
      this.receiverUsername = username;
      this.loadConversation();
    },
    startPenalty(friendId) {
      this.currentFriendId = friendId;
      this.page = 'penalty';
    }
  }
};
</script>

<style>
.chat-box {
  border: none;
  background: #1e1e2f;
  padding: 15px;
  height: 300px;
  overflow-y: auto;
  margin: 15px 0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 15px;
  line-height: 1.4;
  color: white;
  word-wrap: break-word;
}

.message.self {
  background-color: #0078ff;
  align-self: flex-end;
  border-bottom-right-radius: 0;
}

.message.other {
  background-color: #3a3a4f;
  align-self: flex-start;
  border-bottom-left-radius: 0;
}

ul {
  list-style: none;
  padding: 0;
  text-align: center;
}

li {
  margin: 10px 0;
}

li button {
  background-color: #0078ff;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 5px;
}

li button:hover {
  background-color: #005bb5;
}

input {
  padding: 10px;
  width: 100%;
  max-width: 100%;
  border-radius: 8px;
  border: none;
  margin: 10px 0;
  background: #f5f5f5;
  color: black;
}

button {
  background-color: #0078ff;
  border: none;
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 10px;
}
</style>