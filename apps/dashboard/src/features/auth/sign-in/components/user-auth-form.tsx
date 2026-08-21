import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, Sparkles, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { auth as apiAuth } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Please enter your password'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  redirectTo?: string
}

export function UserAuthForm({ className, redirectTo, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const enterSandbox = (businessName: string = 'Quirk Demo Merchant', email: string = 'demo@quirk.dev') => {
    const demoMerchant = {
      id: 'mch_sandbox_demo_01',
      business_name: businessName,
      email: email,
      avatar_url: '',
    }
    const demoToken = 'pv_sandbox_token_' + Date.now()
    auth.setUser(demoMerchant)
    auth.setAccessToken(demoToken)
    apiAuth.setToken(demoToken)

    toast.success('Connected to Quirk Sandbox Control Plane')
    const targetPath = redirectTo || '/dashboard'
    navigate({ to: targetPath, replace: true })
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const response = await apiAuth.login(data)

      // Set user and access token in auth store & cookie
      auth.setUser(response.merchant)
      auth.setAccessToken(response.token)
      apiAuth.setToken(response.token)

      toast.success(`Welcome back, ${response.merchant.business_name || response.merchant.email}!`)

      const targetPath = redirectTo || '/dashboard'
      navigate({ to: targetPath, replace: true })
    } catch (err: any) {
      console.warn('Backend Login Notice:', err)
      
      // If backend is not deployed or unreachable, seamlessly activate Sandbox Mode
      const isNetworkError = !err.response || err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')
      if (isNetworkError) {
        toast.info('Backend server is currently offline. Loaded Sandbox Control Plane.')
        enterSandbox('Quirk Merchant', data.email)
        return
      }

      const errorMessage = err.response?.data?.error || err.message || 'Invalid email or password.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-5', className)} {...props}>
      {/* 1-Click Interactive Sandbox Button */}
      <Button
        type='button'
        variant='outline'
        onClick={() => enterSandbox()}
        className='h-12 w-full border-[#22303A] bg-[#11161D] hover:bg-[#171D26] text-[#F5F7FA] font-medium flex items-center justify-between px-4 transition-all group'
      >
        <div className='flex items-center gap-2.5 text-xs font-mono'>
          <span className='size-2 rounded-full bg-[#ABFF2A] animate-pulse'></span>
          <span>Explore Live Sandbox Mode</span>
        </div>
        <ArrowRight className='size-3.5 text-[#A9B0BB] group-hover:translate-x-0.5 group-hover:text-[#ABFF2A] transition-all' />
      </Button>

      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-[#22303A]' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-card px-2 text-[#A9B0BB] font-mono text-[11px]'>
            Or sign in with credentials
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xs font-medium text-[#A9B0BB]'>Email address</FormLabel>
                <FormControl>
                  <Input
                    placeholder='merchant@company.com'
                    type='email'
                    autoCapitalize='none'
                    autoComplete='email'
                    autoCorrect='off'
                    disabled={isLoading}
                    className='bg-[#11161D] border-[#22303A] text-[#F5F7FA]'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center justify-between'>
                  <FormLabel className='text-xs font-medium text-[#A9B0BB]'>Password</FormLabel>
                </div>
                <FormControl>
                  <PasswordInput
                    placeholder='••••••••'
                    autoComplete='current-password'
                    disabled={isLoading}
                    className='bg-[#11161D] border-[#22303A] text-[#F5F7FA]'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            disabled={isLoading}
            className='h-11 w-full text-sm font-semibold transition-all'
          >
            {isLoading ? (
              <Loader2 className='mr-2 size-4 animate-spin' />
            ) : null}
            Sign in to Dashboard
          </Button>
        </form>
      </Form>
    </div>
  )
}
