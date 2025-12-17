<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/dashboard">💰 Kas Organisasi</router-link>
      </div>
      
      <div class="navbar-menu">
        <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
        <router-link to="/budgets" class="nav-link">Budgets</router-link>
        <router-link to="/categories" class="nav-link">Categories</router-link>
        <router-link to="/transactions" class="nav-link">Transactions</router-link>
      </div>
      
      <div class="navbar-user">
        <span class="user-name">{{ userName }}</span>
        <button @click="logout" class="btn-logout">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter();
    const userName = ref('User');

    onMounted(() => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      userName.value = user.name || 'User';
    });

    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    };

    return {
      userName,
      logout
    };
  }
};
</script>

<style scoped>
.navbar {
  background: #1f2937;
  color: white;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.navbar-brand a {
  color: white;
  text-decoration: none;
  font-size: 20px;
  font-weight: 700;
}

.navbar-menu {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: #d1d5db;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 5px;
  transition: all 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: #374151;
  color: white;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-name {
  color: #d1d5db;
  font-size: 14px;
}

.btn-logout {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: #dc2626;
}
</style>
