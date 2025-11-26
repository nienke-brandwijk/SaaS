import React, { Suspense } from 'react';
import RegisterForm from './registerForm';

export default async function Page({ searchParams }: { searchParams?: Promise<{ redirect?: string }> }) {
  const params = await searchParams;
  const redirectTo = (params && params.redirect) || '/';
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm redirectTo={redirectTo} />
    </Suspense>
  );
}