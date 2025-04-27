<template>
  <div class="chat-container">
    <div v-if="page === 'chat'">
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
        <div v-for="msg in messages" :key="msg.id" class="message" :class="{ self: msg.sender_id === user.id, other: msg.sender_id !== user.id }">
          {{ msg.content }}
        </div>
      </div>

      <input v-model="newMessage" placeholder="Écrire un message..." @keyup.enter="sendMessageToUser" />
      <button @click="sendMessageToUser">Envoyer</button>

      <br /><br />
      <button @click="$emit('logout')">Déconnexion</button>
    </div>

    <PenaltyGame v-else-if="page === 'penalty'" :user="user" :friendId="currentFriendId" :serverUrl="serverUrl" @back="page = 'chat'" />
  </div>
</template>

<script>
import axios from 'axios';
import PenaltyGame from './PenaltyGame.vue';

export default {
  components: { PenaltyGame },
  props: ['user'],
  data() {
    return {
      page: 'chat',
      currentFriendId: null,
      receiverUsername: '',
      receiverId: null,
      newMessage: '',
      messages: [],
      friends: [],
      polling: null,
      serverUrl: import.meta.env.VITE_API_URL
    };
  },
  mounted() {
    this.fetchFriends();
  },
  methods: {
    async fetchFriends() {
      const res = await axios.get(`${this.serverUrl}/api/friends/list/${this.user.id}`);
      const rawFriends = res.data;
      const mapped = await Promise.all(
        rawFriends.map(async f => {
          const otherId = f.requester_id === this.user.id ? f.receiver_id : f.requester_id;
          const resUser = await axios.get(`${this.serverUrl}/api/users/by-id/${otherId}`);
          return { id: otherId, username: resUser.data.username };
        })
      );
      this.friends = Array.from(new Map(mapped.map(f => [f.id, f])).values());
    },
    async startConversationWith(username) {
      this.receiverUsername = username;
      await this.loadConversation();
    },
    async startPenalty(friendId) {
      await axios.post(`${this.serverUrl}/api/duels/start`, {
        player1_id: this.user.id,
        player2_id: friendId
      });
      this.currentFriendId = friendId;
      this.page = 'penalty';
    }
  }
};
</script>


<style scoped>
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