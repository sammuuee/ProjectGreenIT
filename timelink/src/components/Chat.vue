<!-- src/components/Chat.vue -->
<template>
  <div>
    <h2>Bienvenue {{ user.username }}</h2>
    <button @click="$emit('go-friends')"> Ajouter des amis</button>
    <h3>Mes amis</h3>
    <ul>
      <li v-for="a in friends" :key="a.id">
        <button @click="startConversationWith(a.username)">
          💬 {{ a.username }}
        </button>
        <button @click="duelWith(a.id)">
          ⚔️ Duel
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
  </div>
</template>

<script>
export default {
  props: ['user'],
  data() {
    return {
      receiverUsername: '',
      receiverId: null,
      newMessage: '',
      messages: [],
      friends: [],
      polling: null,
      serverUrl: 'http://10.3.203.73:3000'
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
    async fetchFriends() {
      const res = await fetch(`${this.serverUrl}/api/friends/list/${this.user.id}`);
      const rawFriends = await res.json();

      const mapped = await Promise.all(
        rawFriends.map(async f => {
          const otherId = f.requester_id === this.user.id ? f.receiver_id : f.requester_id;
          const res = await fetch(`${this.serverUrl}/api/users/by-id/${otherId}`);
          const data = await res.json();
          return { id: otherId, username: data.username };
        })
      );

      this.friends = mapped;
    },
    async startConversationWith(username) {
      this.receiverUsername = username;
      await this.loadConversation();
    },
    async fetchReceiverIdFromUsername() {
      const res = await fetch(`${this.serverUrl}/api/users/by-username/${this.receiverUsername}`);
      const data = await res.json();
      if (res.ok) {
        this.receiverId = data.id;
        return true;
      } else {
        alert(data.message || 'Utilisateur inconnu');
        return false;
      }
    },
    async loadConversation() {
      const ok = await this.fetchReceiverIdFromUsername();
      if (!ok) return;

      const res = await fetch(`${this.serverUrl}/api/messages/between/${this.user.id}/${this.receiverId}`);
      const data = await res.json();
      this.messages = data;
    },
    async sendMessageToUser() {
      const ok = await this.fetchReceiverIdFromUsername();
      if (!ok || !this.newMessage.trim()) return;

      // Bloque si pas amis
      const res = await fetch(`${this.serverUrl}/api/friends/status/${this.user.id}/${this.receiverId}`);
      const data = await res.json();

      if (data.status !== 'accepted') {
        alert('Vous devez être amis pour discuter.');
        return;
      }

      await fetch(`${this.serverUrl}/api/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: this.user.id,
          receiver_id: this.receiverId,
          content: this.newMessage
        })
      });

      this.newMessage = '';
      this.loadConversation();
    },
    async duelWith(friendId) {
      // Empêcher de faire 2 duels par jour
      const check = await fetch(`${this.serverUrl}/api/duels/today/${this.user.id}/${friendId}`);
      const { alreadyPlayed } = await check.json();

      if (alreadyPlayed) {
        alert('Vous avez déjà fait un duel aujourd’hui !');
        return;
      }

      const duel = await fetch(`${this.serverUrl}/api/duels/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player1_id: this.user.id,
          player2_id: friendId
        })
      });

      const result = await duel.json();
      const message = result.winner_id === this.user.id ? 'Tu as gagné ! 🏆' : 'Tu as perdu... 😢';
      alert(`Duel terminé !\n${message}`);
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