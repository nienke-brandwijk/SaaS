import { NextRequest } from 'next/server';
import { getUserByUsernameController } from '../../../../src/controller/user.controller';

export async function GET(
    req: NextRequest, 
    { params }: any
) {
  return getUserByUsernameController(req, { params });
}
