<template>
  <div class="users-page">
    <div class="page-header">
      <h1>👥 User Management</h1>
      <p class="subtitle">Kelola pengguna sistem (Admin Only)</p>
    </div>

    <div v-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <div v-if="success" class="alert alert-success">
      {{ success }}
    </div>

    <div class="users-table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Tanggal Dibuat</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="text-center">Loading...</td>
          </tr>
          <tr v-else-if="users.length === 0">
            <td colspan="6" class="text-center">Tidak ada user</td>
          </tr>
          <tr v-else v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="'role-' + user.role">
                {{ user.role === 'admin' ? '👑 Admin' : '👤 Member' }}
              </span>
            </td>
            <td>{{ formatDate(user.created_at) }}</td>
            <td>
              <div class="action-buttons">
                <button 
                  v-if="user.id !== currentUserId"
                  @click="toggleRole(user)" 
                  class="btn btn-sm btn-warning"
                  :disabled="actionLoading[user.id]"
                >
                  {{ actionLoading[user.id] ? '...' : (user.role === 'admin' ? 'Make Member' : 'Make Admin') }}
                </button>
                <button 
                  v-if="user.id !== currentUserId"
                  @click="confirmDelete(user)" 
                  class="btn btn-sm btn-danger"
                  :disabled="actionLoading[user.id]"
                >
                  {{ actionLoading[user.id] ? '...' : 'Delete' }}
                </button>
                <span v-else class="current-user-badge">You</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content" @click.stop>
        <h3>Confirm Delete</h3>
        <p>Apakah Anda yakin ingin menghapus user <strong>{{ userToDelete?.name }}</strong>?</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="btn btn-secondary">Cancel</button>
          <button @click="deleteUser" class="btn btn-danger" :disabled="deleteLoading">
            {{ deleteLoading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api/axios';

export default {
  name: 'Users',
  setup() {
    const router = useRouter();
    const users = ref([]);
    const loading = ref(false);
    const error = ref('');
    const success = ref('');
    const currentUserId = ref(null);
    const actionLoading = reactive({});
    const showDeleteModal = ref(false);
    const userToDelete = ref(null);
    const deleteLoading = ref(false);

    onMounted(() => {
      // Check if user is admin
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      currentUserId.value = user.id;
      
      if (user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      
      fetchUsers();
    });

    const fetchUsers = async () => {
      try {
        loading.value = true;
        error.value = '';
        const response = await apiClient.get('/auth/users');
        
        if (response.data.success) {
          users.value = response.data.data.users;
        }
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to fetch users';
      } finally {
        loading.value = false;
      }
    };

    const toggleRole = async (user) => {
      try {
        actionLoading[user.id] = true;
        error.value = '';
        success.value = '';
        
        const newRole = user.role === 'admin' ? 'member' : 'admin';
        
        const response = await apiClient.put(`/auth/users/${user.id}/role`, {
          role: newRole
        });
        
        if (response.data.success) {
          success.value = `User ${user.name} role changed to ${newRole}`;
          await fetchUsers();
        }
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to update user role';
      } finally {
        actionLoading[user.id] = false;
      }
    };

    const confirmDelete = (user) => {
      userToDelete.value = user;
      showDeleteModal.value = true;
    };

    const deleteUser = async () => {
      if (!userToDelete.value) return;
      
      try {
        deleteLoading.value = true;
        error.value = '';
        success.value = '';
        
        const response = await apiClient.delete(`/auth/users/${userToDelete.value.id}`);
        
        if (response.data.success) {
          success.value = `User ${userToDelete.value.name} deleted successfully`;
          showDeleteModal.value = false;
          userToDelete.value = null;
          await fetchUsers();
        }
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to delete user';
        showDeleteModal.value = false;
      } finally {
        deleteLoading.value = false;
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    return {
      users,
      loading,
      error,
      success,
      currentUserId,
      actionLoading,
      showDeleteModal,
      userToDelete,
      deleteLoading,
      fetchUsers,
      toggleRole,
      confirmDelete,
      deleteUser,
      formatDate
    };
  }
};
</script>

<style scoped>
.users-page {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 32px;
  color: #1f2937;
  margin-bottom: 5px;
}

.subtitle {
  color: #6b7280;
  font-size: 16px;
}

.alert {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
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

.users-table-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: #f9fafb;
}

.users-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.users-table td {
  padding: 15px;
  border-bottom: 1px solid #f3f4f6;
}

.users-table tbody tr:hover {
  background: #f9fafb;
}

.role-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.role-badge.role-admin {
  background: #fef3c7;
  color: #92400e;
}

.role-badge.role-member {
  background: #dbeafe;
  color: #1e40af;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-warning {
  background: #fbbf24;
  color: #78350f;
}

.btn-warning:hover:not(:disabled) {
  background: #f59e0b;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.current-user-badge {
  color: #059669;
  font-weight: 600;
  font-size: 13px;
}

.text-center {
  text-align: center;
  padding: 30px;
  color: #6b7280;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #1f2937;
}

.modal-content p {
  color: #6b7280;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
