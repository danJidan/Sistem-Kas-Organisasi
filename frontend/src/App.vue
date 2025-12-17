<template>
  <div id="app">
    <Navbar v-if="isAuthenticated" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  },
  setup() {
    const router = useRouter();
    const isAuthenticated = ref(false);

    const checkAuth = () => {
      const token = localStorage.getItem('token');
      isAuthenticated.value = !!token;
    };

    onMounted(() => {
      checkAuth();
      
      // Listen for storage changes (logout from other tabs)
      window.addEventListener('storage', checkAuth);
    });

    // Watch route changes to update auth status
    router.afterEach(() => {
      checkAuth();
    });

    return {
      isAuthenticated
    };
  }
};
</script>

<style>
#app {
  min-height: 100vh;
  background: #f5f7fa;
}

.main-content {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Global styles */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 5px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.table th,
.table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.table tr:hover {
  background: #f9fafb;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.badge-success {
  background: #d1fae5;
  color: #065f46;
}

.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}

.badge-info {
  background: #dbeafe;
  color: #1e40af;
}

.alert {
  padding: 12px 16px;
  border-radius: 5px;
  margin-bottom: 15px;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alert-success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}
</style>
