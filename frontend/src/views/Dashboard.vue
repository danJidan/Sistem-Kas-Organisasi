<template>
  <div class="dashboard">
    <h1>📊 Dashboard</h1>
    
    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else>
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="card summary-card income">
          <h3>Total Income</h3>
          <p class="amount">Rp {{ formatNumber(summary.totalIncome) }}</p>
        </div>
        
        <div class="card summary-card expense">
          <h3>Total Expense</h3>
          <p class="amount">Rp {{ formatNumber(summary.totalExpense) }}</p>
        </div>
        
        <div class="card summary-card balance">
          <h3>Balance</h3>
          <p class="amount">Rp {{ formatNumber(summary.balance) }}</p>
        </div>
        
        <div class="card summary-card count">
          <h3>Total Transactions</h3>
          <p class="amount">{{ summary.transactionCount }}</p>
        </div>
      </div>
      
      <!-- Latest Transactions -->
      <div class="card">
        <h2>📝 Latest Transactions</h2>
        <table class="table" v-if="summary.lastTransactions && summary.lastTransactions.length > 0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Budget</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trx in summary.lastTransactions" :key="trx.id">
              <td>{{ trx.trx_date }}</td>
              <td>{{ trx.budget_name }}</td>
              <td>{{ trx.category_name }}</td>
              <td>
                <span :class="['badge', trx.trx_type === 'income' ? 'badge-success' : 'badge-danger']">
                  {{ trx.trx_type }}
                </span>
              </td>
              <td>Rp {{ formatNumber(trx.amount) }}</td>
              <td>
                <router-link :to="`/transactions/${trx.id}`" class="btn btn-sm btn-primary">
                  Detail
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="no-data">No transactions yet</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import apiClient from '../api/axios';

export default {
  name: 'Dashboard',
  setup() {
    const loading = ref(true);
    const summary = ref({
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      transactionCount: 0,
      lastTransactions: []
    });

    const fetchSummary = async () => {
      try {
        const response = await apiClient.get('/summary');
        if (response.data.success) {
          summary.value = response.data.data;
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
      } finally {
        loading.value = false;
      }
    };

    const formatNumber = (num) => {
      return new Intl.NumberFormat('id-ID').format(num || 0);
    };

    onMounted(() => {
      fetchSummary();
    });

    return {
      loading,
      summary,
      formatNumber
    };
  }
};
</script>

<style scoped>
.dashboard h1 {
  margin-bottom: 30px;
  color: #1f2937;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  text-align: center;
  padding: 25px;
}

.summary-card h3 {
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
}

.summary-card .amount {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.summary-card.income {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.summary-card.income h3,
.summary-card.income .amount {
  color: white;
}

.summary-card.expense {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.summary-card.expense h3,
.summary-card.expense .amount {
  color: white;
}

.summary-card.balance {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.summary-card.balance h3,
.summary-card.balance .amount {
  color: white;
}

.summary-card.count {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.summary-card.count h3,
.summary-card.count .amount {
  color: white;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #6b7280;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}
</style>
