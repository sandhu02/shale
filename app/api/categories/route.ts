import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

export async function POST(request : NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const { name, icon, sub, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const categoryData = {
      name: name.trim(),
      icon: icon || null,
      sub: sub ? sub.trim() : null,
      description: description || null,
    };

    const newCategory = new Category(categoryData);
    await newCategory.save();

    return NextResponse.json(
      { success: true, data: newCategory },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as { code?: number; name?: string; errors?: Record<string, { message: string }> };

    if (err.code === 11000) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    if (err.name === 'ValidationError' && err.errors) {
      const messages = Object.values(err.errors).map((e) => e.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }

    console.error('Create category error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ name: 1 });
    return NextResponse.json({ success: true, data: categories }, { status: 200 });
  } catch (error) {
    console.error('Fetch categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}