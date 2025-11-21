import { NextRequest } from 'next/server';
import { addUserController } from '../../../src/controller/user.controller';

export async function POST(req: NextRequest) {
  return addUserController(req);
}