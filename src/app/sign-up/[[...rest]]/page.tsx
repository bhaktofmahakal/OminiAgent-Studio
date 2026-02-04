import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignUp 
        forceRedirectUrl="/dashboard"
        signInUrl="/sign-in"
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