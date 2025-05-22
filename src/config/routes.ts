export const routes = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    logout: '/auth/logout',
  },
  admin: {
    home: '/admin',
    users: 'admin/users',
    profile: 'admin/profile',
    settings: '/admin/settings'
  },
  api: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      me: '/api/auth/me',
    },
  },
} as const;

// Type for route paths
export type RoutePath = typeof routes[keyof typeof routes][keyof typeof routes[keyof typeof routes]]; 