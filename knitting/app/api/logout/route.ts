import { logoutController } from '../../../src/controller/user.controller';

export async function POST() {
  return logoutController();
}