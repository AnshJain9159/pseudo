"use client";
import React from 'react';
import { Brain, Lock, ArrowLeft } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { signInSchema } from 'schemas/signInSchema';
import { useToast } from 'hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from 'components/ui/form';

const LoginPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast({
            title: "Login failed",
            description: "Incorrect username or password",
            variant: "destructive",
             className: "bg-red-700 text-white"
          });
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
             className: "bg-red-700 text-white"
          });
        }
      } else if (result?.url) {
        router.replace('/');
        setTimeout(() => {
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
         className: "bg-red-700 text-white"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 relative">
      <Link href="/" className="absolute top-4 left-4">
        <Button
          variant="ghost"
          className="p-2 rounded-full bg-gray-700 bg-opacity-50 hover:bg-opacity-75 transition-all duration-300"
        >
          <ArrowLeft className="h-6 w-6 text-gray-300" />
        </Button>
      </Link>
      <div className="max-w-md w-full space-y-8 p-10 bg-gray-900 border border-gray-700 rounded-xl shadow-lg">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 text-purple-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-100">
            Sign in to Socrates
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Unlock your AI-powered coding assistant.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Email address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-100 bg-gray-800 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                        placeholder="Email address"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-100 bg-gray-800 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                disabled={form.formState.isSubmitting}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-purple-500 group-hover:text-purple-400" aria-hidden="true" />
                </span>
                {form.formState.isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Sign in'
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="font-medium text-purple-500 hover:text-purple-400">
              Sign up for Socrates
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
