export const adminQueryKeys = {
  all: ['admins'] as const,
  detail: (id: number) => ['admins', id] as const,
};