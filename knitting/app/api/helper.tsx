import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET as string;

export function authenticate(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  let token = null;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    token = req.cookies.get("token")?.value;
  }
  if (!token) {
    throw new Error('Unauthorized');
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    throw new Error('Invalid token');
  }
}
