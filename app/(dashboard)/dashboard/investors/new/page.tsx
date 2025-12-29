import { createInvestor } from '../actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewInvestorPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Agregar Inversor</h1>
        <Link href="/dashboard/investors">
          <Button variant="outline">Volver</Button>
        </Link>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Datos del Inversor</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createInvestor} className="space-y-4">
            <div>
              <label htmlFor="code" className="mb-2 block text-sm font-medium text-gray-700">
                Código *
              </label>
              <Input
                type="text"
                id="code"
                name="code"
                required
                placeholder="INV001"
                className="w-full"
              />
              <p className="mt-1 text-sm text-gray-500">
                Código único para identificar al inversor
              </p>
            </div>

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                Nombre Completo *
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Juan Pérez"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email *
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                required
                placeholder="juan@example.com"
                className="w-full"
              />
              <p className="mt-1 text-sm text-gray-500">
                El inversor usará este email para acceder al PWA
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Crear Inversor
              </Button>
              <Link href="/dashboard/investors" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

