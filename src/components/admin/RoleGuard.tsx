'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthManager } from '@/lib/auth';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

/**
 * RoleGuard Component
 * Protects sections of the admin panel based on the user's role.
 */
export default function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackPath = '/admin' 
}: RoleGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = AuthManager.getInstance();
    const user = auth.getUser();
    const isAuthenticated = !!auth.getToken();

    if (!user || !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!allowedRoles.includes(user.role || '')) {
      router.push(fallbackPath);
      return;
    }

    setIsAuthorized(true);
    setLoading(false);
  }, [router, allowedRoles, fallbackPath]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
