import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { updateAdmin } from '../actions';

export default async function EditAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = await prisma.user.findUnique({
    where: { id },
  });

  if (!admin) {
    notFound();
  }

  async function handleSubmit(formData: FormData) {
    'use server';
    try {
      await updateAdmin(id, formData);
    } catch (error) {
      throw error;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Editar Admin</h1>
        <Link href="/dashboard/admins">
          <Button variant="outline">Volver</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del Administrador</CardTitle>
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
                defaultValue={admin.email}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nombre (opcional)
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={admin.name || ''}
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
                defaultValue={admin.role}
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
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

