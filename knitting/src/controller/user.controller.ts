import { NextRequest, NextResponse } from 'next/server';
import userService from '../service/user.service';

export async function getAllUsersController() {
  try {
    const users = await userService.getAllUsers();
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', errorMessage: error.message },
      { status: 500 }
    );
  }
}