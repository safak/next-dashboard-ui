import AcmeLogo from '@/components/ui/acme-logo';
import LoginForm from '@/components/ui/login-form';
import { Suspense } from 'react';
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <AcmeLogo />
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
