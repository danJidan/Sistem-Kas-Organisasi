<template>
  <div class="deletion-requests-page">
    <div class="page-header">
      <h1>🗑️ Deletion Requests</h1>
      <p class="subtitle">Review and manage transaction deletion requests from members</p>
    </div>

    <div v-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <div v-if="success" class="alert alert-success">
      {{ success }}
    </div>

    <!-- Filter -->
    <div class="card filters">
      <div class="filter-group">
        <label>Status:</label>
        <select v-model="filterStatus" @change="fetchRequests">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>

    <div class="requests-table-container">
      <table class="requests-table">
        <thead>
          <tr>
            <th>Date Requested</th>
            <th>Requester</th>
            <th>Transaction</th>
            <th>Amount</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="text-center">Loading...</td>
          </tr>
          <tr v-else-if="requests.length === 0">
            <td colspan="7" class="text-center">No deletion requests found</td>
          </tr>
          <tr v-else v-for="request in requests" :key="request.id">
            <td>{{ formatDate(request.created_at) }}</td>
            <td>
              <strong>{{ request.requester_name }}</strong><br>
              <small>{{ request.requester_email }}</small>
            </td>
            <td>
              <strong>{{ request.category_name }}</strong><br>
              <small>{{ request.budget_name }} | {{ request.trx_date }}</small><br>
              <span :class="['badge', request.trx_type === 'income' ? 'badge-success' : 'badge-danger']">
                {{ request.trx_type }}
              </span>
            </td>
            <td>Rp {{ formatNumber(request.amount) }}</td>
            <td>
              <div class="reason-cell">{{ request.reason }}</div>
            </td>
            <td>
              <span :class="['status-badge', `status-${request.status}`]">
                {{ request.status }}
              </span>
              <div v-if="request.reviewed_at" class="reviewed-info">
                <small>by {{ request.reviewer_name }}</small><br>
                <small>{{ formatDate(request.reviewed_at) }}</small>
              </div>
              <div v-if="request.admin_note" class="admin-note">
                <small><em>"{{ request.admin_note }}"</em></small>
              </div>
            </td>
            <td>
              <div v-if="request.status === 'pending'" class="action-buttons">
                <button @click="approveRequest(request)" class="btn btn-sm btn-success">Approve</button>
                <button @click="rejectRequest(request)" class="btn btn-sm btn-danger">Reject</button>
              </div>
              <span v-else class="text-muted">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Review Modal -->
    <div v-if="showReviewModal" class="modal-overlay" @click="showReviewModal = false">
      <div class="modal-content" @click.stop>
        <h3>{{ reviewAction === 'approve' ? '✅ Approve' : '❌ Reject' }} Deletion Request</h3>
        <div class="request-details">
          <p><strong>Transaction:</strong> {{ selectedRequest?.category_name }} - Rp {{ formatNumber(selectedRequest?.amount) }}</p>
          <p><strong>Requested by:</strong> {{ selectedRequest?.requester_name }}</p>
          <p><strong>Reason:</strong> {{ selectedRequest?.reason }}</p>
        </div>
        <div class="form-group">
          <label>Admin Note (optional):</label>
          <textarea v-model="adminNote" rows="3" placeholder="Add a note for the member..."></textarea>
        </div>
        <div class="modal-actions">
          <button @click="showReviewModal = false" class="btn btn-secondary">Cancel</button>
          <button 
            @click="submitReview" 
            :class="['btn', reviewAction === 'approve' ? 'btn-success' : 'btn-danger']"
            :disabled="reviewLoading"
          >
            {{ reviewLoading ? 'Processing...' : (reviewAction === 'approve' ? 'Approve & Delete Transaction' : 'Reject Request') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api/axios';

export default {
  name: 'DeletionRequests',
  setup() {
    const router = useRouter();
    const requests = ref([]);
    const loading = ref(false);
    const error = ref('');
    const success = ref('');
    const filterStatus = ref('');
    const showReviewModal = ref(false);
    const selectedRequest = ref(null);
    const reviewAction = ref('');
    const adminNote = ref('');
    const reviewLoading = ref(false);

    onMounted(() => {
      // Check if user is admin
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      
      fetchRequests();
    });

    const fetchRequests = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        const params = {};
        if (filterStatus.value) {
          params.status = filterStatus.value;
        }
        
        const response = await apiClient.get('/deletion-requests', { params });
        
        if (response.data.success) {
          requests.value = response.data.data.requests;
        }
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to fetch deletion requests';
      } finally {
        loading.value = false;
      }
    };

    const approveRequest = (request) => {
      selectedRequest.value = request;
      reviewAction.value = 'approve';
      adminNote.value = '';
      showReviewModal.value = true;
    };

    const rejectRequest = (request) => {
      selectedRequest.value = request;
      reviewAction.value = 'reject';
      adminNote.value = '';
      showReviewModal.value = true;
    };

    const submitReview = async () => {
      if (!selectedRequest.value) return;
      
      try {
        reviewLoading.value = true;
        error.value = '';
        success.value = '';
        
        const endpoint = `/deletion-requests/${selectedRequest.value.id}/${reviewAction.value}`;
        const data = adminNote.value ? { admin_note: adminNote.value } : {};
        
        const response = await apiClient.post(endpoint, data);
        
        if (response.data.success) {
          success.value = response.data.message;
          showReviewModal.value = false;
          selectedRequest.value = null;
          adminNote.value = '';
          await fetchRequests();
        }
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to process request';
      } finally {
        reviewLoading.value = false;
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num || 0);

    return {
      requests,
      loading,
      error,
      success,
      filterStatus,
      showReviewModal,
      selectedRequest,
      reviewAction,
      adminNote,
      reviewLoading,
      fetchRequests,
      approveRequest,
      rejectRequest,
      submitReview,
      formatDate,
      formatNumber
    };
  }
};
</script>

<style scoped>
.deletion-requests-page {
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

.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 20px;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 600;
  color: #374151;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.requests-table-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.requests-table {
  width: 100%;
  border-collapse: collapse;
}

.requests-table thead {
  background: #f9fafb;
}

.requests-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.requests-table td {
  padding: 15px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}

.requests-table tbody tr:hover {
  background: #f9fafb;
}

.reason-cell {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  font-size: 13px;
  color: #4b5563;
}

.status-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.status-approved {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.status-rejected {
  background: #fee2e2;
  color: #991b1b;
}

.reviewed-info {
  margin-top: 5px;
  color: #6b7280;
}

.admin-note {
  margin-top: 5px;
  padding: 5px;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 12px;
  color: #4b5563;
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

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
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

.text-center {
  text-align: center;
  padding: 30px;
  color: #6b7280;
}

.text-muted {
  color: #9ca3af;
  font-size: 14px;
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
  max-width: 600px;
  width: 90%;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #1f2937;
}

.request-details {
  background: #f9fafb;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.request-details p {
  margin: 8px 0;
  color: #374151;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
}

.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
}

.badge-success {
  background: #d1fae5;
  color: #065f46;
}

.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}
</style>
