<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/dashboard">💰 Kas Organisasi</router-link>
      </div>
      
      <div class="navbar-menu">
        <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
        <!-- Menu khusus admin -->
        <router-link v-if="isAdmin" to="/budgets" class="nav-link">Budgets</router-link>
        <router-link v-if="isAdmin" to="/categories" class="nav-link">Categories</router-link>
        <!-- Menu untuk semua user -->
        <router-link to="/transactions" class="nav-link">Transactions</router-link>
        <!-- Menu khusus admin -->
        <router-link v-if="isAdmin" to="/deletion-requests" class="nav-link">
          Deletion Requests
          <span v-if="pendingCount > 0" class="badge-count">{{ pendingCount }}</span>
        </router-link>
        <router-link v-if="isAdmin" to="/users" class="nav-link admin-link">👥 Users</router-link>
      </div>
      
      <div class="navbar-user">
        <span class="user-role" :class="roleClass">{{ roleText }}</span>
        <span class="user-name">{{ userName }}</span>
        <button @click="logout" class="btn-logout">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api/axios';

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter();
    const userName = ref('User');
    const userRole = ref('member');
    const pendingCount = ref(0);

    const isAdmin = computed(() => userRole.value === 'admin');
    const roleText = computed(() => userRole.value === 'admin' ? '👑 Admin' : '👤 Member');
    const roleClass = computed(() => userRole.value === 'admin' ? 'role-admin' : 'role-member');

    const fetchPendingCount = async () => {
      if (!isAdmin.value) return;
      
      try {
        const response = await apiClient.get('/deletion-requests/pending/count');
        if (response.data.success) {
          pendingCount.value = response.data.data.count;
        }
      } catch (error) {
        // Silently fail
      }
    };

    onMounted(() => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      userName.value = user.name || 'User';
      userRole.value = user.role || 'member';
      
      fetchPendingCount();
      
      // Poll for pending count every 30 seconds if admin
      if (isAdmin.value) {
        setInterval(fetchPendingCount, 30000);
      }
    });

    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    };

    return {
      userName,
      userRole,
      isAdmin,
      roleText,
      roleClass,
      pendingCount,
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
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: #374151;
  color: white;
}

.badge-count {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 700;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-role {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.role-admin {
  background: #fbbf24;
  color: #92400e;
}

.role-member {
  background: #60a5fa;
  color: #1e3a8a;
}

.user-name {
  color: #d1d5db;
  font-size: 14px;
}

.admin-link {
  background: #374151;
  border: 1px solid #fbbf24;
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
