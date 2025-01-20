'use client';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { forgotPasswordSchema } from '@/schemas/forgotPasswordSchema';

export default function ForgotPasswordForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    console.log('Form submitted with data:', data); 
    try {
      const response = await axios.post('/api/forgot-password', data);
      toast({
        title: 'Success',
        description: response.data.message,
      });
      
      router.replace(`/verify-reset/${data.email}`); 
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      const axiosError = error as AxiosError<any>;
      toast({
        title: 'Failed to Send Reset Email',
        description: axiosError.response?.data.message || 'Error sending email',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen " style={{
      background: 'radial-gradient(circle, #000000, #050505, #090909, #0d0d0d, #111111)',
    }}>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Forgot Password?
          </h1>
          <p className="mb-4">Enter your email to reset your password</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Reset Email
                </>
              ) : (
                'Send Reset Code'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}