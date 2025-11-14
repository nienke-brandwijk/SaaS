import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.json({ message: 'Logged Out' });
  res.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  return res;
}
