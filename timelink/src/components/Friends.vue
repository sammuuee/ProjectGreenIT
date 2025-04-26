<template>
  <div>
    <h3>Mes amis</h3>
    <ul>
      <li v-for="f in friends" :key="f.id">
        {{ formatFriend(f) }}
      </li>
    </ul>

    <h3>Demande en attente</h3>
    <ul>
      <li v-for="r in receivedRequests" :key="r.id">
        {{ r.requester_username }}
        <button @click="respond(r.requester_id, 'accepted')">Accepter</button>
        <button @click="respond(r.requester_id, 'rejected')">Refuser</button>
      </li>
    </ul>

    <h3>Ajouter un ami</h3>
    <input v-model="usernameToAdd" placeholder="Nom d'utilisateur" />
    <button @click="addFriend">Envoyer une demande</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['user'],
  data() {
    return {
      usernameToAdd: '',
      friends: [],
      receivedRequests: [],
      serverUrl: import.meta.env.VITE_API_URL
    };
  },
  mounted() {
    this.fetchFriends();
    this.fetchRequests();
  },
  methods: {
    async getUserIdByUsername(username) {
      const res = await axios.get(`${this.serverUrl}/api/users/by-username/${username}`);
      return res.data.id;
    },
    async getUserById(userId) {
      try {
        const res = await axios.get(`${this.serverUrl}/api/users/by-id/${userId}`);
        return res.data.username;
      } catch(e) {
        console.error(`❌ erreur fetch userId: ${userId}`, e);
        return null;
      }
    },
    async addFriend() {
      try {
        const receiverId = await this.getUserIdByUsername(this.usernameToAdd);
        await axios.post(`${this.serverUrl}/api/friends/request`, {
          requester_id: this.user.id,
          receiver_id: receiverId
        });
        alert("Demande envoyée !");
        this.usernameToAdd = '';
      } catch (e) {
        alert(e.message);
      }
    },
    async respond(requesterId, status) {
      await axios.post(`${this.serverUrl}/api/friends/respond`, {
        requester_id: requesterId,
        receiver_id: this.user.id,
        status
      });
      this.fetchRequests();
      this.fetchFriends();
    },
    async fetchFriends() {
      const res = await axios.get(`${this.serverUrl}/api/friends/list/${this.user.id}`);
      const rawFriends = res.data;

      const mapped = await Promise.all(
        rawFriends.map(async f => {
          const otherId = f.requester_id === this.user.id ? f.receiver_id : f.requester_id;
          const username = await this.getUserById(otherId);
          return { id: f.id, username };
        })
      );

      this.friends = mapped;
    },
    async fetchRequests() {
      const res = await axios.get(`${this.serverUrl}/api/friends/pending/${this.user.id}`);
      const requests = res.data;

      const withNames = await Promise.all(
        requests.map(async r => {
          const name = await this.getUserById(r.requester_id);
          return { ...r, requester_username: name };
        })
      );

      this.receivedRequests = withNames;
    },
    formatFriend(f) {
      return `👤 ${f.username}`;
    }
  }
};
</script>