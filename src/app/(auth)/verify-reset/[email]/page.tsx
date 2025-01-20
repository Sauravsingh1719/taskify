'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Define schema for verification and password fields
const verifyResetSchema = z.object({
  code: z.string().min(6, 'Verification code must be at least 6 characters'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'], // Highlight confirmPassword on mismatch
});

export default function VerifyReset() {
  const router = useRouter();
  const params = useParams<{ email: string }>(); // Retrieve email from params
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifyResetSchema>>({
    resolver: zodResolver(verifyResetSchema),
  });

  const onSubmit = async (data: z.infer<typeof verifyResetSchema>) => {
    try {
      const response = await axios.post<any>(`/api/verify-reset`, {
        email: params.email, 
        code: data.code,
        newPassword: data.newPassword,
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace('/sign-in'); // Redirect to sign-in page after success
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      toast({
        title: 'Verification Failed',
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        background: 'radial-gradient(circle, #000000, #050505, #090909, #0d0d0d, #111111)',
      }}
    >
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Reset Your Password
          </h1>
          <p className="mb-4">Enter the OTP and set a new password</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Verification Code Field */}
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} placeholder="Enter OTP" />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password Field */}
            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <Input {...field} type="password" placeholder="New Password" />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input {...field} type="password" placeholder="Confirm Password" />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
