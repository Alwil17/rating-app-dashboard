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
    users: '/admin/users',
    categories: '/admin/categories',
    tags: '/admin/tags',
    profile: '/admin/profile',
    settings: '/admin/settings',
    ratings: '/admin/ratings',
    items: '/admin/items',
  },
  api: {
    auth: {
      login: '/auth/token',
      register: '/auth/register',
      me: '/auth/me',
    },
  },
} as const;

// Type for route paths
export type RoutePath = typeof routes[keyof typeof routes][keyof typeof routes[keyof typeof routes]]; 