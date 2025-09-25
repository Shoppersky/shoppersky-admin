import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-7xl">
        <LoginForm />
      </div>
    </div>
  )
}
