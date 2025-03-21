import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from './mongoose';
import User from '@/models/User';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Only keep the JWT declaration that's needed
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    subscription: {
      type: string | null;
      startDate: Date | null;
      endDate: Date | null;
      status: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found with this email');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        // Check subscription status
        // if (user.subscription.status === 'active' && user.subscription.endDate) {
        //   const now = new Date();
        //   if (now > user.subscription.endDate) {
        //     // Update subscription status to not_subscribed
        //     user.subscription.status = 'not_subscribed';
        //     user.subscription.type = null;
        //     user.subscription.startDate = null;
        //     user.subscription.endDate = null;
        //     await user.save();
        //   }
        // }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          subscription: user.subscription
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.subscription = user.subscription;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
        session.user.subscription = token.subscription as {
          type: string | null;
          startDate: Date | null;
          endDate: Date | null;
          status: string;
        };
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
};

export default authOptions; 