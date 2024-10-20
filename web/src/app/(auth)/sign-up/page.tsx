"use client";
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { signUpSchema } from '@/schemas/signUpSchema';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosError } from "axios";
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';


const RegisterPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'student',
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const response = await axios.post<ApiResponse>('/api/auth/sign-up', data);

      if (response.status === 300) {
        toast({
          title: 'Multiple Choices',
          description: 'Multiple options available. Please contact support.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: response.data.message,
          variant: 'default'
        });
        
        router.replace(`/sign-in`);
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      const axiosError = error as AxiosError<ApiResponse>;

      let errorMessage = axiosError.response?.data.message || 'There was a problem with your sign-up. Please try again.';

      if (axiosError.response?.status === 300) {
        errorMessage = 'Multiple choices are available. Please contact support.';
      }
      
      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
      <Link href="/" className="absolute top-4 left-4">
        <Button
          variant="ghost"
          className="p-2 rounded-full bg-white bg-opacity-10 hover:bg-opacity-30 transition-all duration-300"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </Button>
      </Link>
      <div className="max-w-lg w-full space-y-8 p-10 bg-gray-800 bg-opacity-60 rounded-xl shadow-2xl backdrop-filter backdrop-blur-lg border border-gray-700">
        <div className="text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-indigo-500" />
          <h2 className="mt-6 text-4xl font-extrabold font-gamer">Join Socrates</h2>
          <p className="mt-2 text-sm text-gray-300">
            Dive into coding challenges and AI-assisted learning on Data Structures and Algorithms.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Full Name"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-500 placeholder-gray-400 text-gray-300 bg-black focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 focus:z-10 sm:text-sm"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Email address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Email address"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-500 placeholder-gray-400 text-gray-300 bg-black focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 focus:z-10 sm:text-sm"
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
                      placeholder="Password"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-500 placeholder-gray-400 text-gray-300 bg-black focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 focus:z-10 sm:text-sm"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Role (Student/Teacher)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Role (Student/Teacher)"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-500 placeholder-gray-400 text-gray-300 bg-black focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 focus:z-10 sm:text-sm"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 transition duration-300 ease-in-out transform hover:scale-105 text-sm font-medium rounded-lg text-black bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={form.formState.isSubmitting}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300" aria-hidden="true" />
              </span>
              {form.formState.isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Register'
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/sign-in" className="font-medium text-indigo-500 hover:text-indigo-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
