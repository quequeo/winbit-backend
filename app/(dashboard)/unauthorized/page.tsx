import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center text-red-600">Acceso No Autorizado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-700">
            Tu email no está autorizado para acceder al panel de administración.
          </p>
          <p className="text-center text-sm text-gray-500">
            Si creés que esto es un error, contactá al administrador del sistema.
          </p>
          <div className="flex justify-center pt-4">
            <form
              action={async () => {
                'use server';
                const { signOut } = await import('@/lib/auth');
                await signOut({ redirectTo: '/login' });
              }}
            >
              <Button type="submit" variant="outline">
                Cerrar Sesión
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

