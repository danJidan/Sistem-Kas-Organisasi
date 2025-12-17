<template>
  <div class="categories">
    <div class="header">
      <h1>📂 Categories</h1>
      <button @click="showForm = true" class="btn btn-primary">+ Add Category</button>
    </div>
    
    <div v-if="showForm" class="modal">
      <div class="modal-content card">
        <h2>{{ editingId ? 'Edit Category' : 'Add New Category' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Name *</label>
            <input v-model="form.name" required />
          </div>
          <div class="form-group">
            <label>Type *</label>
            <select v-model="form.type" required>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" rows="3"></textarea>
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
            <th>Type</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td><strong>{{ category.name }}</strong></td>
            <td>
              <span :class="['badge', category.type === 'income' ? 'badge-success' : category.type === 'expense' ? 'badge-danger' : 'badge-info']">
                {{ category.type }}
              </span>
            </td>
            <td>{{ category.description || '-' }}</td>
            <td>
              <span :class="['badge', category.is_active ? 'badge-success' : 'badge-danger']">
                {{ category.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <button @click="editCategory(category)" class="btn btn-sm btn-primary">Edit</button>
              <button @click="deleteCategory(category.id)" class="btn btn-sm btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import apiClient from '../api/axios';

export default {
  name: 'Categories',
  setup() {
    const categories = ref([]);
    const showForm = ref(false);
    const editingId = ref(null);
    const form = ref({ name: '', type: 'expense', description: '', is_active: 1 });

    const fetchCategories = async () => {
      const response = await apiClient.get('/categories');
      if (response.data.success) categories.value = response.data.data.categories;
    };

    const handleSubmit = async () => {
      try {
        if (editingId.value) {
          await apiClient.put(`/categories/${editingId.value}`, form.value);
        } else {
          await apiClient.post('/categories', form.value);
        }
        cancelForm();
        fetchCategories();
      } catch (error) {
        alert(error.response?.data?.message || 'Error saving category');
      }
    };

    const editCategory = (category) => {
      editingId.value = category.id;
      form.value = { ...category };
      showForm.value = true;
    };

    const deleteCategory = async (id) => {
      if (!confirm('Delete this category?')) return;
      try {
        await apiClient.delete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting category');
      }
    };

    const cancelForm = () => {
      showForm.value = false;
      editingId.value = null;
      form.value = { name: '', type: 'expense', description: '', is_active: 1 };
    };

    onMounted(fetchCategories);

    return { categories, showForm, editingId, form, handleSubmit, editCategory, deleteCategory, cancelForm };
  }
};
</script>

<style scoped>
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; }
.form-actions { display: flex; gap: 10px; margin-top: 20px; }
.btn-sm { padding: 6px 12px; font-size: 12px; margin-right: 5px; }
</style>
