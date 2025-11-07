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

export async function getUserByUsernameController(req: NextRequest, { params }: { params: { username: string } }) {
  try {
    const { username } = params;
    if (!username) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'Username is required in URL.' },
        { status: 400 }
      );
    }
    const user = await userService.getUserByUsername(username);
    if (!user) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'User not found.' },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: 'success', data: user });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', errorMessage: error.message },
      { status: 500 }
    );
  }
}

export async function addUserController(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, firstName, lastName, email, password } = body;
    if (!username || !firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'All fields are required.' },
        { status: 400 }
      );
    }
    const newUser = await userService.addUser({
      username,
      firstName,
      lastName,
      email,
      password,
    });
    return NextResponse.json(
      { status: 'success', data: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', errorMessage: error.message },
      { status: 500 }
    );
  }
}

export async function loginController(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'Username and password are required.' },
        { status: 400 }
      );
    }
    const user = await userService.login(username, password);
    if (!user) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'Invalid username or password.' },
        { status: 401 }
      );
    }
    return NextResponse.json({ status: 'success', data: { username: user.username } });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', errorMessage: error.message },
      { status: 500 }
    );
  }
};