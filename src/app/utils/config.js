const getBaseURL = () => {
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : `https://${process.env.NEXT_PUBLIC_DOMAIN_URL || 'localhost:3000'}`;
  };
  
  export const API_BASE_URL = getBaseURL();