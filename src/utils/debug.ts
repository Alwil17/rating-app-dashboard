export const logAuthDebug = (message: string, data?: any) => {
  if (process.env.NEXT_PUBLIC_BUILD_ID !== 'production') {
    console.log(`[Auth Debug] ${message}`, data || '');
  }
};
