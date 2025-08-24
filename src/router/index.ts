import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import LandingPage from '@/pages/LandingPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';
import { useAuthStore } from '@/store/authStore';

// Dashboard layout & pages
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import Tasks from '@/pages/TasksPage.vue'
import Settings from '@/pages/SettingsPage.vue'
import Roles from '@/pages/RolesPage.vue'
import Users from '@/pages/UsersPage.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Landing', component: LandingPage },
  { path: '/login', name: 'Login', component: LoginPage, meta: {guestOnly: true} },
  { path: '/register', name: 'Register', component: RegisterPage, meta: {guestOnly: true} },
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardPage,
        // meta: { roles : ['admin', 'manager', 'employee'] } // restrict to certain roles
      },
      {
        path: 'tasks',
        name: 'Tasks',
        component: Tasks
      },
      {
        path: 'roles',
        name: 'Roles',
        component: Roles
      },
      {
        path: 'users',
        name: 'Users',
        component: Users
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Settings
      }
    ],
    meta: { requiresAuth: true } // protect dashboard
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  
  if (to.meta.requiresAuth && !auth.token) {
    return { name: 'Login' }; // Redirect unauthenticated users to login
  }
  // if (to.meta.roles && !to.meta.roles.includes(authStore.userRole)) {
  //   return next('/not-authorized')
  // }
  if (to.meta.guestOnly && auth.token) {
    return { name: 'Dashboard' }; // Redirect authenticated users away from guest-only routes
  }
  
  // Uncomment and implement this if you have a dashboard or other protected routes
  // if (to.meta.requiresAuth && !isAuthenticated) {
  //   return { name: 'Login' }; // Redirect unauthenticated users to login
  // }
});

export default router;
