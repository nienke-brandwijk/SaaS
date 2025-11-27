import { NextRequest } from "next/server";
import { uploadImageController } from "../../../../src/controller/user.controller";

export async function POST(req: NextRequest) {
  return uploadImageController(req);
}
