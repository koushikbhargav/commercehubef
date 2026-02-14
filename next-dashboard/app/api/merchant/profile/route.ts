import { NextResponse } from 'next/server';
import { getMerchantByEmail } from '../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
  }

  const profile = await getMerchantByEmail(email);

  if (!profile) {
    return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: profile });
}
