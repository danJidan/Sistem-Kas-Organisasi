import { createRouter, createWebHistory } from 'vue-router';

// Import views
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Budgets from '../views/Budgets.vue';
import Categories from '../views/Categories.vue';
import Transactions from '../views/Transactions.vue';
import TransactionForm from '../views/TransactionForm.vue';
import TransactionDetail from '../views/TransactionDetail.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/budgets',
    name: 'Budgets',
    component: Budgets,
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories,
    meta: { requiresAuth: true }
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: Transactions,
    meta: { requiresAuth: true }
  },
  {
    path: '/transactions/new',
    name: 'TransactionNew',
    component: TransactionForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/transactions/:id',
    name: 'TransactionDetail',
    component: TransactionDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/transactions/:id/edit',
    name: 'TransactionEdit',
    component: TransactionForm,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard: protect routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !token) {
    // Route requires auth but user not logged in
    next('/login');
  } else if (to.path === '/login' && token) {
    // User already logged in, redirect to dashboard
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
