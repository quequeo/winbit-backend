import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createAdmin } from '../actions';

export default function NewAdminPage() {
  async function handleSubmit(formData: FormData) {
    'use server';
    try {
      await createAdmin(formData);
    } catch (error) {
      throw error;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Agregar Admin</h1>
        <Link href="/dashboard/admins">
          <Button variant="outline">Volver</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nuevo Administrador</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                El email debe coincidir con el usado para iniciar sesión con Google
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nombre (opcional)
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Nombre del administrador"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-gray-700">
                Rol
              </label>
              <select
                id="role"
                name="role"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#58b098] focus:outline-none focus:ring-1 focus:ring-[#58b098]"
                defaultValue="ADMIN"
              >
                <option value="ADMIN">Admin</option>
                <option value="SUPERADMIN">Super Admin</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/dashboard/admins">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit">Crear Admin</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

