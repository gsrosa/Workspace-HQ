import { getServerSession as getNextAuthSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

export const getServerSession = () => {
  return getNextAuthSession(authOptions);
};

