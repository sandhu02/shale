import { NextRequest, NextResponse } from "next/server";
import uploadToCloudinary from "@/lib/cloudinary";
import { v2 as cloudinary } from "cloudinary";

import dbConnect from "@/lib/db";
import Item from "@/models/Item";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    await dbConnect();

    const { id } = await params;

    const item = await Item.findById(id).populate(
      "category",
      "name"
    );

    if (!item) {
      return NextResponse.json(
        {
          error: "Item not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: item,
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


// In app/api/items/[id]/route.ts

export async function PUT(
  request: NextRequest,
  { params }: Props
) {
  try {
    await dbConnect();

    const { id } = await params;
    const formData = await request.formData();

    // Extract fields from form data
    const name = formData.get("name")?.toString();
    const category = formData.get("category")?.toString();
    const description = formData.get("description")?.toString() || "";
    const price = Number(formData.get("price"));
    const discount = Number(formData.get("discount") || 0);
    const inStock = formData.get("inStock")?.toString() === "true";
    const stock = Number(formData.get("stock") || 0);
    
    const sizes = formData
      .get("sizes")
      ?.toString()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean) || [];

    const colors = formData
      .get("colors")
      ?.toString()
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean) || [];

    // Get images to delete
    const imagesToDelete = formData.getAll("imagesToDelete").map(url => url.toString());

    // Validation
    if (name && !name.trim()) {
      return NextResponse.json(
        { error: "Item name cannot be empty" },
        { status: 400 }
      );
    }

    // Check if item exists
    const existingItem = await Item.findById(id);
    if (!existingItem) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    // Handle image uploads if new images are provided
    const files = formData
      .getAll("images")
      .filter((file): file is File => file instanceof File);

    let images = existingItem.images;
    
    // Remove deleted images
    if (imagesToDelete.length > 0) {
      images = images.filter((img: string) => !imagesToDelete.includes(img));
      
      // Optional: Delete from Cloudinary
      for (const imageUrl of imagesToDelete) {
        const publicId = imageUrl.split('/').pop()?.split('.')[0];
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(`items/${publicId}`);
          } catch (error) {
            console.error('Failed to delete image from Cloudinary:', error);
          }
        }
      }
    }
    
    // Upload new images
    if (files.length > 0) {
      const newImages = await Promise.all(
        files.map((file) => uploadToCloudinary(file))
      );
      images = [...images, ...newImages];
    }

    // Generate slug if name is changed
    const slug = name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') : existingItem.slug;

    // Prepare update data
    const updateData = {
      name: name || existingItem.name,
      category: category || existingItem.category,
      description: description || existingItem.description,
      price: price || existingItem.price,
      discount: discount || existingItem.discount || 0,
      sizes: sizes.length > 0 ? sizes : existingItem.sizes,
      colors: colors.length > 0 ? colors : existingItem.colors,
      inStock: inStock !== undefined ? inStock : existingItem.inStock,
      stock: stock || existingItem.stock || 0,
      images,
      slug,
    };

    // Update the item
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name");

    return NextResponse.json({
      success: true,
      data: updatedItem,
    });

  } catch (error: any) {
    console.error(error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          error: "An item with this name already exists",
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

// Optional: Add a PATCH method for partial updates
export async function PATCH(
  request: NextRequest,
  { params }: Props
) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await request.json();

    const existingItem = await Item.findById(id);
    if (!existingItem) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    // Only update fields that are provided
    const updateData: any = {};
    
    if (body.name) {
      updateData.name = body.name;
      updateData.slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    
    if (body.category !== undefined) updateData.category = body.category;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.discount !== undefined) updateData.discount = body.discount;
    if (body.sizes !== undefined) updateData.sizes = body.sizes;
    if (body.colors !== undefined) updateData.colors = body.colors;
    if (body.inStock !== undefined) updateData.inStock = body.inStock;
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (body.images !== undefined) updateData.images = body.images;

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name");

    return NextResponse.json({
      success: true,
      data: updatedItem,
    });

  } catch (error: any) {
    console.error(error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          error: "An item with this name already exists",
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

// Optional: Add DELETE method
export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  try {
    await dbConnect();

    const { id } = await params;

    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    // Optionally delete images from Cloudinary here
    for (const imageUrl of item.images) {
      const publicId = imageUrl.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`items/${publicId}`);
      }
    }

    await Item.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Item deleted successfully",
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