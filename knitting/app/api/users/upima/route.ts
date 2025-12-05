import { NextRequest, NextResponse } from "next/server";
import { uploadImageController } from "../../../../src/controller/user.controller";
import { authenticate } from '../../helper';

export async function POST(req: NextRequest) {
  try {
      const user = authenticate(req);
      return uploadImageController(req);
    } catch (error: any) {
      return NextResponse.json(
        { status: 'error', errorMessage: error.message },
        { status: 401 }
      );
    }
}
