import React, { Suspense } from 'react';
import RegisterForm from './registerForm';

export default async function Page({ searchParams }: { searchParams?: { redirect?: string } }) {
  const redirectTo = (searchParams && searchParams.redirect) || '/';
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm redirectTo={redirectTo} />
    </Suspense>
  );
}