'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { useState } from 'react';
import Image from 'next/image';

export default function SignInForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
      setIsSubmitting(true);
  
      try {
          const result = await signIn('credentials', {
              redirect: false,
              identifier: data.identifier,
              password: data.password,
              callbackUrl: '/dashboard',
          });
  
          if (result?.error) {
              const errorMessage =
                  result.error === 'CredentialsSignin'
                      ? 'Incorrect username or password'
                      : result.error;
  
              toast({
                  title: 'Login Failed',
                  description: errorMessage,
                  variant: 'destructive',
              });
          } else {
              await router.push('/dashboard');
          }
      } catch (error) {
          toast({
              title: 'Unexpected Error',
              description: 'Something went wrong. Please try again.',
              variant: 'destructive',
          });
      } finally {
          setIsSubmitting(false);
      }
  };
  

    return (
        <div className= 'min-h-screen lg:w-max grid grid-cols-1 md:grid-cols-2 items-center justify-center  mx-10 lg:mx-60 lg:px-48 sm:px-10 py-5'>
            <div>
                    <Image
                        src='/loginavtar.png'
                        alt='loginavtarrrr'
                        width={300}
                        height={300}
                    />
            </div>
            <div>
            <div className="flex justify-center items-center" >
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome Back to toDo
                    </h1>
                    <p className="mb-4">Sign in to continue your work management</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
                                    <Input {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='items-center justify-center flex'>
                        <Button className='w-max' type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </Button>
                        </div>
                    </form>
                </Form>
                <div className="text-center">
                    <p>
                        Forgot Password?{' '}
                        <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800">
                            Reset Password
                        </Link>
                    </p>
                </div>
                <div className="text-center">
                    <p>
                        Not a member yet?{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
        </div>

        </div>
            );
}