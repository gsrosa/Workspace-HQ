import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    signIn: async (email: string, password: string) => {
      return signIn('credentials', {
        email,
        password,
        redirect: false,
      });
    },
    signOut: () => signOut({ redirect: true, callbackUrl: '/login' }),
  };
};

