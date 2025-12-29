import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Permitir acceso a la página de unauthorized sin verificación
  if (pathname === '/dashboard/unauthorized') {
    return NextResponse.next();
  }

  // Si está intentando acceder al dashboard pero no está autorizado
  if (pathname.startsWith('/dashboard') && session) {
    const userEmail = session.user?.email;
    if (userEmail) {
      const { prisma } = await import('@/lib/prisma');
      const allowedUser = await prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (!allowedUser) {
        return NextResponse.redirect(new URL('/dashboard/unauthorized', request.url));
      }
    }
  }

  // Si no está autenticado y está en dashboard, redirigir a login
  if (pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

