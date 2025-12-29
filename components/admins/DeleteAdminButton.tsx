'use client';

import { Button } from '@/components/ui/button';
import { deleteAdmin } from '@/app/(dashboard)/dashboard/admins/actions';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteAdminButtonProps {
  adminId: string;
  currentUserEmail?: string;
}

export function DeleteAdminButton({
  adminId,
  currentUserEmail,
}: DeleteAdminButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que querés eliminar este admin?')) {
      startTransition(async () => {
        try {
          await deleteAdmin(adminId, currentUserEmail);
          router.refresh();
        } catch (error) {
          alert(error instanceof Error ? error.message : 'Error al eliminar admin');
        }
      });
    }
  };

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? 'Eliminando...' : 'Eliminar'}
    </Button>
  );
}

