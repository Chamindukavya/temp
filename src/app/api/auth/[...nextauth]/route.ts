import NextAuth, { DefaultSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    subscription: {
      type: string | null;
      startDate: Date | null;
      endDate: Date | null;
      status: string;
    };
  }
  interface Session {
    user: {
      id: string;
      role: string;
      subscription: User['subscription'];
    } & DefaultSession['user']
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 