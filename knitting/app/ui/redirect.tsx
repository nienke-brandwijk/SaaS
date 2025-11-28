'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../../lib/auth'; 

export default function ProtectedRedirect({ user }: { user: any }) {
  const router = useRouter();
  useEffect(() => {
    const checkUser = async () => {
      try {
        if (user) {
          router.replace('/create');
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkUser();
  }, [router]);
  if (user) return null;
  return null;
}
