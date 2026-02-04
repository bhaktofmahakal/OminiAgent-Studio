import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignIn 
        forceRedirectUrl="/dashboard"
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
            card: 'shadow-lg'
          }
        }}
      />
    </div>
  )
}