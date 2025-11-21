import { NextRequest } from 'next/server';
import { updateProgressController } from '../../../../src/controller/user.controller';

export async function PUT(req: NextRequest) {
  return updateProgressController(req);
}