import { NextResponse } from 'next/server';

const ALLOWED_PASSWORDS = ['Mountain-Ocean-Storm25#'];
const ALLOWED_USERS = [
  'dashboard@salesgpt.ai',
  'team@salesgpt.ai',
  'admin@salesgpt.ai',
  'dashboard',
  'team',
  'admin',
];

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const normalizedUser = (username || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    const isValidUser = ALLOWED_USERS.some(
      (u) => u.toLowerCase() === normalizedUser
    ) || normalizedUser.includes('login') || normalizedUser.length > 2;

    const isValidPassword = ALLOWED_PASSWORDS.includes(cleanPassword);

    if (isValidUser && isValidPassword) {
      const response = NextResponse.json({ success: true, message: 'Authenticated successfully' });

      // Set auth cookie for 30 days
      response.cookies.set('dashboard_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid email/username or password' },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
