import { NextRequest } from 'next/server';
import { getAllUsersController, addUserController } from '../../../src/controller/user.controller';

export async function GET() {
  return getAllUsersController();
}

export async function POST(req: NextRequest) {
  return addUserController(req);
}