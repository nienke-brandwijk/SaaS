import { NextRequest, NextResponse } from 'next/server';
import userService from '../service/user.service';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

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
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'email and password are required.' },
        { status: 400 }
      );
    }
    const user = await userService.login(email, password);
    if (!user) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'Invalid email or password.' },
        { status: 401 }
      );
    }
    const token = jwt.sign(
      { id: user, username: email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    const res = NextResponse.json({
      message: 'Login successful',
      user: { userId: user },
    });
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60,
    });
    return res;
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', errorMessage: error.message },
      { status: 500 }
    );
  }
};

export async function logoutController() {
    try {
      const cookieStore = await cookies();
      cookieStore.delete('user_session');
      
      return NextResponse.json({ 
        status: 'success', 
        message: 'Logged out successfully' 
      });
    } catch (error: any) {
      return NextResponse.json(
        { status: 'error', errorMessage: error.message },
        { status: 500 }
      );
    }
}