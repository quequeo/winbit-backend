import { signIn } from '@/lib/auth';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Winbit Admin</h1>
          <p className="mt-2 text-sm text-gray-600">
            Iniciar sesión en el panel de administración
          </p>
        </div>
        
        <form
          action={async () => {
            'use server';
            await signIn('google', { redirectTo: '/dashboard' });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-lg bg-[#58b098] px-4 py-3 font-semibold text-white transition hover:bg-[#489880]"
          >
            Iniciar sesión con Google
          </button>
        </form>
      </div>
    </div>
  );
}

