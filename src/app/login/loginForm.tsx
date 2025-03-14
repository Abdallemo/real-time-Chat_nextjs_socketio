'use client'
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema } from '../../../drizzle/schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';
import  {signIn}  from 'next-auth/react';
import { CreateUser } from '@/lib/action';
import { useRouter } from 'next/router';

export type userSchema = z.infer<typeof userSchema>

export default function LoginForm() {
    const router  = useRouter()
                
    const form = useForm<userSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            password: ''
        }
    })
    const { pending } = useFormStatus()

    async function Sign_In(values: userSchema) {
        try {
          const respone = await signIn('credentials',{name:values.name,password:values.password,redirect:false})


            if (respone?.error) {
                toast.error('Login Failed',{description:'Invalid credentials, please sign in',richColors:true})
            }else{
                toast.success('Login Succeed',{richColors:true,cancel:true})
                router.push('/')
            }

    
        } catch (error) {
            toast(`${error}`,{className:'sonner-spinner'})
        }

    }
    async function Sign_Up(values: userSchema) {
        try {
          const respone = await CreateUser(values.name,values.password)
            

            if (respone.status=='error') {
                toast.error('Sign-Up Failed',{description:respone.error,richColors:true})
            }else{
                toast.success('Sign-Up Succeed',{richColors:true,cancel:true})
                router.push('/')
                
            }

    
        } catch (error) {
            toast(`${error}`,{className:'sonner-spinner',})
        }

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
                <Button disabled={pending} type='submit'>{pending ? 'submiting...' : 'Sign-in'}</Button>
                <Button disabled={pending} onClick={form.handleSubmit(Sign_Up)}>{pending ? 'submiting...' : 'Sign-up'}</Button>
            </form>
        </Form>
    )
}
