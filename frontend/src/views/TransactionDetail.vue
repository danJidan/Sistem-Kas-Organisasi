<template>
  <div class="transaction-detail">
    <div class="header">
      <h1>📄 Transaction Detail</h1>
      <div>
        <router-link :to="`/transactions/${$route.params.id}/edit`" class="btn btn-primary">Edit</router-link>
        <router-link to="/transactions" class="btn btn-secondary">Back</router-link>
      </div>
    </div>
    
    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="transaction" class="card">
      <div class="detail-grid">
        <div class="detail-item">
          <label>ID</label>
          <p>{{ transaction.id }}</p>
        </div>
        
        <div class="detail-item">
          <label>Type</label>
          <p>
            <span :class="['badge', transaction.trx_type === 'income' ? 'badge-success' : 'badge-danger']">
              {{ transaction.trx_type }}
            </span>
          </p>
        </div>
        
        <div class="detail-item">
          <label>Amount</label>
          <p class="amount">Rp {{ formatNumber(transaction.amount) }}</p>
        </div>
        
        <div class="detail-item">
          <label>Date</label>
          <p>{{ transaction.trx_date }}</p>
        </div>
        
        <div class="detail-item">
          <label>Budget</label>
          <p>{{ transaction.budget_name }}</p>
        </div>
        
        <div class="detail-item">
          <label>Category</label>
          <p>{{ transaction.category_name }}</p>
        </div>
        
        <div class="detail-item">
          <label>Payment Method</label>
          <p>{{ transaction.payment_method }}</p>
        </div>
        
        <div class="detail-item">
          <label>Created By</label>
          <p>{{ transaction.created_by_name || '-' }}</p>
        </div>
        
        <div class="detail-item full-width">
          <label>Note</label>
          <p>{{ transaction.note || '-' }}</p>
        </div>
        
        <div class="detail-item full-width" v-if="transaction.meta">
          <label>Meta (JSON)</label>
          <pre class="meta-json">{{ formatJSON(transaction.meta) }}</pre>
        </div>
        
        <div class="detail-item">
          <label>Created At</label>
          <p>{{ transaction.created_at }}</p>
        </div>
        
        <div class="detail-item">
          <label>Updated At</label>
          <p>{{ transaction.updated_at }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '../api/axios';

export default {
  name: 'TransactionDetail',
  setup() {
    const route = useRoute();
    const loading = ref(true);
    const transaction = ref(null);

    const fetchTransaction = async () => {
      try {
        const response = await apiClient.get(`/transactions/${route.params.id}`);
        if (response.data.success) {
          transaction.value = response.data.data.transaction;
        }
      } catch (error) {
        alert('Error fetching transaction');
      } finally {
        loading.value = false;
      }
    };

    const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num || 0);
    
    const formatJSON = (json) => {
      if (typeof json === 'string') {
        try {
          return JSON.stringify(JSON.parse(json), null, 2);
        } catch (e) {
          return json;
        }
      }
      return JSON.stringify(json, null, 2);
    };

    onMounted(fetchTransaction);

    return { loading, transaction, formatNumber, formatJSON };
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

.header div {
  display: flex;
  gap: 10px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.detail-item label {
  display: block;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 5px;
  font-size: 14px;
}

.detail-item p {
  font-size: 16px;
  color: #1f2937;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.amount {
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
}

.meta-json {
  background: #f3f4f6;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  font-size: 13px;
  color: #1f2937;
}
</style>
