import { NextRequest, NextResponse } from "next/server";
import uploadToCloudinary from "@/lib/cloudinary"

import dbConnect from "@/lib/db";
import Item from "@/models/Item";


export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const formData = await request.formData();

    const name = formData.get("name")?.toString();
    const category = formData.get("category")?.toString();
    const description = formData.get("description")?.toString() || "";
    const price = Number(formData.get("price"));
    const discount = Number(formData.get("discount") || 0);

    const inStock = formData.get("inStock")?.toString() === "true";
    
    const stock = Number(formData.get("stock") || 0);
    
    const sizes =
      formData
        .get("sizes")
        ?.toString()
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean) || [];

    const colors =
      formData
        .get("colors")
        ?.toString()
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean) || [];

    if (!name) {
      return NextResponse.json(
        { error: "Item name is required" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (!price || Number.isNaN(price)) {
      return NextResponse.json(
        { error: "Invalid price" },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const files = formData
      .getAll("images")
      .filter((file): file is File => file instanceof File);

    const images = await Promise.all(
      files.map((file) => uploadToCloudinary(file))
    );

    const item = await Item.create({
      name,
      category,
      description,
      price,
      discount,
      sizes,
      colors,
      inStock,
      images,
      slug,
      stock,
    });

    return NextResponse.json(
      {
        success: true,
        data: item,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error(error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          error: "Item already exists",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    const items = await Item.find()
      .populate("category", "name")
      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}