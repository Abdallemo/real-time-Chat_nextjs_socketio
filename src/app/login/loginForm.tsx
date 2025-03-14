'use client'
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema } from '../../../drizzle/schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { CreateUser } from '@/lib/action';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export type userSchema = z.infer<typeof userSchema>

export default function LoginForm() {
    const router = useRouter()

    const form = useForm<userSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            password: ''
        }
    })
    const [isLoading1, setIsLoading1] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);

    async function Sign_In(values: userSchema) {
        setIsLoading1(true);
        try {
            const response = await signIn('credentials', { name: values.name, password: values.password, redirect: false })


            if (response?.error) {
                toast.error('Login Failed', { description: 'Invalid credentials, please sign in', richColors: true })
            } else {
                toast.success('Login Succeed', { richColors: true, cancel: true })
                router.push('/')
            }


        } catch (error) {
            toast(`${error}`, { className: 'sonner-spinner' })
        }
        setIsLoading1(false);

    }
    async function Sign_Up(values: userSchema) {
        setIsLoading2(true);
        try {
            const response = await CreateUser(values.name, values.password)


            if (response.status == 'error') {
                toast.error('Sign-Up Failed', { description: response.error, richColors: true })
            } else {
                toast.success('Sign-Up Succeed', { richColors: true, cancel: true })
                router.push('/')

            }


        } catch (error) {
            toast(`${error}`, { className: 'sonner-spinner', })
        }
        setIsLoading2(false);
    }
    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(Sign_In)} className='flex flex-col gap-2 px-4 py-1'>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (

                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder='Username' {...field} />
                            </FormControl>
                            <FormDescription>your name will be public</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField control={form.control} name='password' render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input placeholder='password' {...field} type='password' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button disabled={isLoading1 || isLoading2} type='submit'>{isLoading1 ? <Loader2 className='animate-spin' /> : 'Sign-in'}</Button>
                <Button disabled={isLoading2 || isLoading1} onClick={form.handleSubmit(Sign_Up)}>{isLoading2 ? <Loader2 className='animate-spin' /> : 'Sign-up'}</Button>
            </form>
        </Form>
    )
}
