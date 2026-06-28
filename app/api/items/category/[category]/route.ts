import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import Item from "@/models/Item";

type Props = {
  params: Promise<{
    category: string;
  }>;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(
  _request: NextRequest,
  { params }: Props
) {
  try {
    await dbConnect();

    const { category } = await params;
    const decodedCategory = decodeURIComponent(category).trim();

    if (!decodedCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "Category name is required",
        },
        { status: 400 }
      );
    }

    const items = await Item.find({
      category: {
        $regex: new RegExp(`^${escapeRegExp(decodedCategory)}$`, "i"),
      },
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

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
