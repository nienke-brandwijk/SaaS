import { NextRequest } from 'next/server';
import { getAllUsersController } from '../../../src/controller/user.controller';

export async function GET() {
  return getAllUsersController();
}

