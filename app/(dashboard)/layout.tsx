import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-[#58b098]">Winbit Admin</h1>
            <p className="text-sm text-gray-600">{session.user?.email}</p>
          </div>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/login' });
            }}
          >
            <button
              type="submit"
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
        <nav className="border-t border-gray-200 bg-white px-6">
          <div className="flex space-x-8">
            <Link
              href="/dashboard"
              className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-700 hover:border-[#58b098] hover:text-[#58b098]"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/investors"
              className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-700 hover:border-[#58b098] hover:text-[#58b098]"
            >
              Inversores
            </Link>
            <Link
              href="/dashboard/requests"
              className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-700 hover:border-[#58b098] hover:text-[#58b098]"
            >
              Solicitudes
            </Link>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

