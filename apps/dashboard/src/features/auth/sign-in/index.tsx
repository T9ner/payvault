import { Link, useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const search = useSearch({ strict: false }) as Record<string, string | undefined>
  const redirect = search?.redirect

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-xl font-bold tracking-tight font-["Satoshi"]'>
            Merchant Sign In
          </CardTitle>
          <CardDescription className='text-xs'>
            Enter your merchant email and password to access the control plane.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
        <CardFooter className='flex flex-col gap-3'>
          <div className='text-center text-xs text-muted-foreground'>
            Don't have a merchant account?{' '}
            <Link
              to='/sign-up'
              className='font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors'
            >
              Sign up
            </Link>
          </div>
          <p className='px-4 text-center text-[11px] text-muted-foreground'>
            By signing in, you agree to our{' '}
            <Link
              to='/terms'
              className='underline underline-offset-4 hover:text-foreground'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              to='/privacy'
              className='underline underline-offset-4 hover:text-foreground'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
