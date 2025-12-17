<template>
  <div class="transaction-form">
    <h1>{{ isEdit ? '✏️ Edit Transaction' : '➕ Add New Transaction' }}</h1>
    
    <div class="card">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Budget *</label>
          <select v-model="form.budget_id" required>
            <option value="">Select Budget</option>
            <option v-for="budget in budgets" :key="budget.id" :value="budget.id">
              {{ budget.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Category *</label>
          <select v-model="form.category_id" required>
            <option value="">Select Category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }} ({{ category.type }})
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Type *</label>
          <select v-model="form.trx_type" required>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Amount *</label>
          <input v-model="form.amount" type="number" step="0.01" required />
        </div>
        
        <div class="form-group">
          <label>Date *</label>
          <input v-model="form.trx_date" type="date" required />
        </div>
        
        <div class="form-group">
          <label>Payment Method</label>
          <select v-model="form.payment_method">
            <option value="cash">Cash</option>
            <option value="transfer">Transfer</option>
            <option value="ewallet">E-Wallet</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Note</label>
          <textarea v-model="form.note" rows="3"></textarea>
        </div>
        
        <div class="form-group">
          <label>Meta (JSON)</label>
          <textarea v-model="metaString" rows="3" placeholder='{"receipt_url": "...", "pic_name": "..."}'></textarea>
          <small>Optional: Add flexible data in JSON format</small>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-success">{{ isEdit ? 'Update' : 'Create' }}</button>
          <router-link to="/transactions" class="btn btn-secondary">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiClient from '../api/axios';

export default {
  name: 'TransactionForm',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isEdit = computed(() => route.params.id && route.name === 'TransactionEdit');
    
    const budgets = ref([]);
    const categories = ref([]);
    const form = ref({
      budget_id: '',
      category_id: '',
      trx_type: 'expense',
      amount: 0,
      trx_date: new Date().toISOString().split('T')[0],
      payment_method: 'cash',
      note: '',
      meta: null
    });
    const metaString = ref('');

    const fetchBudgets = async () => {
      const response = await apiClient.get('/budgets');
      if (response.data.success) budgets.value = response.data.data.budgets;
    };

    const fetchCategories = async () => {
      const response = await apiClient.get('/categories');
      if (response.data.success) categories.value = response.data.data.categories;
    };

    const fetchTransaction = async () => {
      if (isEdit.value) {
        const response = await apiClient.get(`/transactions/${route.params.id}`);
        if (response.data.success) {
          const trx = response.data.data.transaction;
          form.value = {
            budget_id: trx.budget_id,
            category_id: trx.category_id,
            trx_type: trx.trx_type,
            amount: trx.amount,
            trx_date: trx.trx_date,
            payment_method: trx.payment_method,
            note: trx.note || '',
            meta: trx.meta
          };
          if (trx.meta) {
            metaString.value = typeof trx.meta === 'string' ? trx.meta : JSON.stringify(trx.meta, null, 2);
          }
        }
      }
    };

    const handleSubmit = async () => {
      try {
        // Parse meta if provided
        if (metaString.value.trim()) {
          try {
            form.value.meta = JSON.parse(metaString.value);
          } catch (e) {
            alert('Invalid JSON format for Meta');
            return;
          }
        } else {
          form.value.meta = null;
        }

        if (isEdit.value) {
          await apiClient.put(`/transactions/${route.params.id}`, form.value);
        } else {
          await apiClient.post('/transactions', form.value);
        }
        router.push('/transactions');
      } catch (error) {
        alert(error.response?.data?.message || 'Error saving transaction');
      }
    };

    onMounted(() => {
      fetchBudgets();
      fetchCategories();
      fetchTransaction();
    });

    return { isEdit, budgets, categories, form, metaString, handleSubmit };
  }
};
</script>

<style scoped>
.transaction-form h1 { margin-bottom: 20px; }
.form-actions { display: flex; gap: 10px; margin-top: 20px; }
small { color: #6b7280; display: block; margin-top: 5px; }
</style>
