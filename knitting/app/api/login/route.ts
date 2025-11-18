import { NextRequest } from 'next/server';
import { loginController } from '../../../src/controller/user.controller';

export async function POST(req: NextRequest) {
  return await loginController(req);
}