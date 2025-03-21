'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawCallbackUrl = searchParams.get('callbackUrl') || '/';
  let callbackUrl = rawCallbackUrl;

  if (rawCallbackUrl.includes('callbackUrl=')) {
    try {
      while (callbackUrl.includes('callbackUrl=')) {
        const match = callbackUrl.match(/callbackUrl=([^&]+)/);
        if (match && match[1]) {
          callbackUrl = decodeURIComponent(match[1]);
        } else {
          break;
        }
      }
      console.log('Decoded nested callbackUrl to:', callbackUrl);
    } catch (e) {
      console.error('Error decoding nested callbackUrl:', e);
      callbackUrl = '/';
    }
  }

  if (callbackUrl.includes('/login') || callbackUrl.includes('/register')) {
    callbackUrl = '/';
  }

  if (callbackUrl.length > 500) {
    console.warn('CallbackUrl too long, resetting to home');
    callbackUrl = '/';
  }

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      console.log('Attempting sign in with callbackUrl:', callbackUrl);
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl: String(callbackUrl),
        redirect: false,
      });

      console.log('signIn result:', result);

      if (result?.error) {
        toast.error(result.error);
      } else {
        console.log('Sign in successful, redirecting to:', callbackUrl);
        window.location.href = callbackUrl;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </CardContent>
        <div className="text-center pb-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-500">
              Register here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}