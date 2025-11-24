import NextAuth from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getToken } from 'next-auth/jwt';

// Create a singleton instance
const { auth } = NextAuth(authOptions);

export const getServerSession = async (req?: Request) => {
  if (req) {
    // For API routes with explicit Request, use getToken directly
    // getToken works with Request objects in Next.js App Router
    try {
      const token = await getToken({ 
        req: req as any, 
        secret: process.env.NEXTAUTH_SECRET 
      });
      
      if (!token) {
        return null;
      }
      
      // Return session-like object matching NextAuth's session structure
      return {
        user: {
          id: (token.sub || token.id || '') as string,
          email: (token.email || '') as string,
          name: (token.name || null) as string | null,
        },
      };
    } catch (error) {
      // If getToken fails, return null (unauthenticated)
      console.error('Error getting token:', error);
      return null;
    }
  }
  
  // For server components, use auth() which uses Async Context
  return await auth();
};
