import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeleteAdminButton } from '@/components/admins/DeleteAdminButton';

export default async function AdminsPage() {
  const admins = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admins</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los usuarios que pueden acceder al panel de administración
          </p>
        </div>
        <Link href="/dashboard/admins/new">
          <Button>Agregar Admin</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Administradores</CardTitle>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No hay administradores registrados. Agregá el primero.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.email}</TableCell>
                    <TableCell>{admin.name || '-'}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          admin.role === 'SUPERADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {admin.role === 'SUPERADMIN' ? 'Super Admin' : 'Admin'}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(admin.createdAt).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/admins/${admin.id}`}>
                          <Button variant="ghost" size="sm">
                            Editar
                          </Button>
                        </Link>
                        <DeleteAdminButton adminId={admin.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

