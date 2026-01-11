import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { createStripeCustomer } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Stripe customer (only if Stripe is configured)
    let stripeCustomerId = 'temp_' + Date.now(); // Temporary ID for development

    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const stripeCustomer = await createStripeCustomer(email, name);
        stripeCustomerId = stripeCustomer.id;
      } catch (error) {
        console.warn('Stripe not configured, using temporary customer ID');
      }
    }

    // Create user with basic subscription record (no services yet)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        subscription: {
          create: {
            stripeCustomerId: stripeCustomerId,
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    );
  }
}
