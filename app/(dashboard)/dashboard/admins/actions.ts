'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const adminSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(1, 'El nombre es requerido').optional(),
  role: z.enum(['ADMIN', 'SUPERADMIN']).default('ADMIN'),
});

export async function createAdmin(formData: FormData) {
  const data = adminSchema.parse({
    email: formData.get('email'),
    name: formData.get('name') || undefined,
    role: formData.get('role') || 'ADMIN',
  });

  // Verificar si ya existe un admin con ese email
  const existingAdmin = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingAdmin) {
    throw new Error('Ya existe un admin con ese email');
  }

  // Crear el admin
  await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      role: data.role as 'ADMIN' | 'SUPERADMIN',
    },
  });

  revalidatePath('/dashboard/admins');
  redirect('/dashboard/admins');
}

export async function updateAdmin(id: string, formData: FormData) {
  const data = adminSchema.parse({
    email: formData.get('email'),
    name: formData.get('name') || undefined,
    role: formData.get('role') || 'ADMIN',
  });

  // Verificar si ya existe otro admin con ese email
  const existingAdmin = await prisma.user.findFirst({
    where: {
      email: data.email,
      NOT: { id },
    },
  });

  if (existingAdmin) {
    throw new Error('Ya existe otro admin con ese email');
  }

  await prisma.user.update({
    where: { id },
    data: {
      email: data.email,
      name: data.name,
      role: data.role as 'ADMIN' | 'SUPERADMIN',
    },
  });

  revalidatePath('/dashboard/admins');
  revalidatePath(`/dashboard/admins/${id}`);
  redirect('/dashboard/admins');
}

export async function deleteAdmin(id: string, currentUserEmail?: string) {
  // Verificar que no sea el último admin
  const adminCount = await prisma.user.count();
  if (adminCount <= 1) {
    throw new Error('No se puede eliminar el último admin');
  }

  // Verificar que el usuario actual sea SUPERADMIN
  if (currentUserEmail) {
    const currentUser = await prisma.user.findUnique({
      where: { email: currentUserEmail },
    });

    if (!currentUser || currentUser.role !== 'SUPERADMIN') {
      throw new Error('Solo los Super Admins pueden eliminar otros administradores');
    }
  }

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath('/dashboard/admins');
}

