export const routes = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    logout: '/auth/logout',
  },
  board: {
    home: '/board',
    profile: '/board/profile',
    settings: '/board/settings',
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