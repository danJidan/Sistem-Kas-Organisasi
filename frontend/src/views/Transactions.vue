<template>
  <div class="transactions">
    <div class="header">
      <h1>💳 Transactions</h1>
      <router-link to="/transactions/new" class="btn btn-primary">+ Add Transaction</router-link>
    </div>
    
    <div class="card filters">
      <h3>Filters</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
        <div class="form-group">
          <label>Type</label>
          <select v-model="filters.trx_type" @change="fetchTransactions">
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div class="form-group">
          <label>Date From</label>
          <input v-model="filters.date_from" type="date" @change="fetchTransactions" />
        </div>
        <div class="form-group">
          <label>Date To</label>
          <input v-model="filters.date_to" type="date" @change="fetchTransactions" />
        </div>
      </div>
    </div>
    
    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Budget</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="trx in transactions" :key="trx.id">
            <td>{{ trx.trx_date }}</td>
            <td>{{ trx.budget_name }}</td>
            <td>{{ trx.category_name }}</td>
            <td>
              <span :class="['badge', trx.trx_type === 'income' ? 'badge-success' : 'badge-danger']">
                {{ trx.trx_type }}
              </span>
            </td>
            <td>Rp {{ formatNumber(trx.amount) }}</td>
            <td>{{ trx.payment_method }}</td>
            <td>
              <router-link :to="`/transactions/${trx.id}`" class="btn btn-sm btn-primary">View</router-link>
              <router-link :to="`/transactions/${trx.id}/edit`" class="btn btn-sm btn-success">Edit</router-link>
              <button @click="deleteTransaction(trx.id)" class="btn btn-sm btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination" v-if="pagination.totalPages > 1">
        <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="btn btn-secondary">Previous</button>
        <span>Page {{ pagination.page }} of {{ pagination.totalPages }}</span>
        <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.totalPages" class="btn btn-secondary">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import apiClient from '../api/axios';

export default {
  name: 'Transactions',
  setup() {
    const transactions = ref([]);
    const filters = ref({ trx_type: '', date_from: '', date_to: '' });
    const pagination = ref({ page: 1, limit: 10, total: 0, totalPages: 1 });

    const fetchTransactions = async () => {
      const params = { page: pagination.value.page, limit: pagination.value.limit, ...filters.value };
      const response = await apiClient.get('/transactions', { params });
      if (response.data.success) {
        transactions.value = response.data.data.transactions;
        pagination.value = response.data.data.pagination;
      }
    };

    const deleteTransaction = async (id) => {
      if (!confirm('Delete this transaction?')) return;
      await apiClient.delete(`/transactions/${id}`);
      fetchTransactions();
    };

    const changePage = (page) => {
      pagination.value.page = page;
      fetchTransactions();
    };

    const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num || 0);

    onMounted(fetchTransactions);

    return { transactions, filters, pagination, fetchTransactions, deleteTransaction, changePage, formatNumber };
  }
};
</script>

<style scoped>
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.filters { margin-bottom: 20px; }
.btn-sm { padding: 6px 12px; font-size: 12px; margin-right: 5px; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
</style>
