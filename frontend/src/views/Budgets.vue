<template>
  <div class="budgets">
    <div class="header">
      <h1>💼 Budgets</h1>
      <button v-if="isAdmin" @click="showForm = true" class="btn btn-primary">+ Add Budget</button>
      <span v-else class="info-text">📖 Viewing budgets (read-only)</span>
    </div>
    
    <div v-if="showForm" class="modal">
      <div class="modal-content card">
        <h2>{{ editingId ? 'Edit Budget' : 'Add New Budget' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Name *</label>
            <input v-model="form.name" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Planned Amount *</label>
            <input v-model="form.planned_amount" type="number" step="0.01" required />
          </div>
          <div class="form-group">
            <label>Start Date *</label>
            <input v-model="form.start_date" type="date" required />
          </div>
          <div class="form-group">
            <label>End Date *</label>
            <input v-model="form.end_date" type="date" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-success">Save</button>
            <button type="button" @click="cancelForm" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    
    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Planned Amount</th>
            <th>Period</th>
            <th>Status</th>
            <th v-if="isAdmin">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="budget in budgets" :key="budget.id">
            <td><strong>{{ budget.name }}</strong></td>
            <td>Rp {{ formatNumber(budget.planned_amount) }}</td>
            <td>{{ budget.start_date }} - {{ budget.end_date }}</td>
            <td>
              <span :class="['badge', budget.is_active ? 'badge-success' : 'badge-danger']">
                {{ budget.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td v-if="isAdmin">
              <button @click="editBudget(budget)" class="btn btn-sm btn-primary">Edit</button>
              <button @click="deleteBudget(budget.id)" class="btn btn-sm btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import apiClient from '../api/axios';

export default {
  name: 'Budgets',
  setup() {
    const budgets = ref([]);
    const showForm = ref(false);
    const editingId = ref(null);
    const form = ref({
      name: '',
      description: '',
      planned_amount: 0,
      start_date: '',
      end_date: '',
      is_active: 1
    });

    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = computed(() => user.role === 'admin');

    const fetchBudgets = async () => {
      try {
        const response = await apiClient.get('/budgets');
        if (response.data.success) {
          budgets.value = response.data.data.budgets;
        }
      } catch (error) {
        alert('Error fetching budgets');
      }
    };

    const handleSubmit = async () => {
      try {
        if (editingId.value) {
          await apiClient.put(`/budgets/${editingId.value}`, form.value);
        } else {
          await apiClient.post('/budgets', form.value);
        }
        cancelForm();
        fetchBudgets();
      } catch (error) {
        alert(error.response?.data?.message || 'Error saving budget');
      }
    };

    const editBudget = (budget) => {
      editingId.value = budget.id;
      form.value = { ...budget };
      showForm.value = true;
    };

    const deleteBudget = async (id) => {
      if (!confirm('Delete this budget?')) return;
      try {
        await apiClient.delete(`/budgets/${id}`);
        fetchBudgets();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting budget');
      }
    };

    const cancelForm = () => {
      showForm.value = false;
      editingId.value = null;
      form.value = { name: '', description: '', planned_amount: 0, start_date: '', end_date: '', is_active: 1 };
    };

    const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num || 0);

    onMounted(fetchBudgets);

    return {
      budgets,
      showForm,
      editingId,
      form,
      isAdmin,
      handleSubmit,
      editBudget,
      deleteBudget,
      cancelForm,
      formatNumber
    };
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
  margin-right: 5px;
}

.info-text {
  color: #6b7280;
  font-size: 14px;
  font-style: italic;
}
</style>
