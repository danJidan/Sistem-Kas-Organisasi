<template>
  <div class="login-container">
    <div class="login-card">
      <h1>🔐 Login</h1>
      <p class="subtitle">Kas Organisasi - Manajemen Keuangan</p>
      
      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="admin@demo.com"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="Admin123!"
          />
        </div>
        
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          {{ loading ? 'Loading...' : 'Login' }}
        </button>
      </form>
      
      <div class="demo-credentials">
        <p><strong>Demo Credentials:</strong></p>
        <p>Admin: admin@demo.com / Admin123!</p>
        <p>Member: member@demo.com / Member123!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api/axios';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const loading = ref(false);

    const handleLogin = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        const response = await apiClient.post('/auth/login', {
          email: email.value,
          password: password.value
        });
        
        if (response.data.success) {
          // Save token and user data
          localStorage.setItem('token', response.data.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
          
          // Redirect to dashboard
          router.push('/dashboard');
        }
      } catch (err) {
        error.value = err.response?.data?.message || 'Login failed. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      error,
      loading,
      handleLogin
    };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #1f2937;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 30px;
  font-size: 14px;
}

.btn-block {
  width: 100%;
  margin-top: 10px;
}

.demo-credentials {
  margin-top: 20px;
  padding: 15px;
  background: #f3f4f6;
  border-radius: 5px;
  font-size: 13px;
}

.demo-credentials p {
  margin: 5px 0;
  color: #4b5563;
}
</style>
