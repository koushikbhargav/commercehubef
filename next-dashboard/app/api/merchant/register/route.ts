import { NextResponse } from 'next/server';
import { saveMerchant } from '../../../lib/db';

/**
 * MOCK BRANDING CONSTANTS
 * In a real app, these would come from a branding service or DB defaults.
 */
const DEFAULT_BRANDING = {
  primaryColor: 'forest-contrast',
  brandVoice: 'Professional, Efficient, Secure',
  brandGuidelines: ''
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, authMethod } = body;

    if (!id || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required merchant fields (id, name, email)' },
        { status: 400 }
      );
    }

    const merchantProfile: any = {
      id,
      name,
      email,
      role: 'owner',
      authMethod,
      createdAt: new Date().toISOString(),
      branding: DEFAULT_BRANDING,
      verificationStatus: 'unverified',
      isOnboarded: false
    };

    // PERSIST TO DISK
    const saved = await saveMerchant(merchantProfile);

    if (!saved) {
      throw new Error('Failed to persist merchant data');
    }

    console.log(`[Backend] Registered and saved merchant: ${name} (${email})`);

    // Return the created profile
    return NextResponse.json({
      success: true,
      message: 'Merchant profile created and saved successfully',
      data: merchantProfile
    });

  } catch (error) {
    console.error('[Backend API Error]', error);
    return NextResponse.json(
      { error: 'Internal Server Error during registration' },
      { status: 500 }
    );
  }
}
