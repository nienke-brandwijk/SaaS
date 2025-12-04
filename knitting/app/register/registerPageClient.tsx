import React, { Suspense } from 'react';
import RegisterForm from './registerForm';

export default async function Page({ searchParams, user }: { searchParams?: Promise<{ redirect?: string }>, user: any }) {
  const params = await searchParams;
  const redirectTo = (params && params.redirect) || '/';
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm redirectTo={redirectTo} user={user}/>
    </Suspense>
  );
}