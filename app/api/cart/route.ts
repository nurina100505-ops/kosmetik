import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

//
// 🔥 GET → ambil cart berdasarkan user_id
//
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = Number(searchParams.get("user_id"));

  if (!user_id) {
    return NextResponse.json(
      { error: "User belum login" },
      { status: 401 }
    );
  }

  const cart = await prisma.carts.findFirst({
    where: { user_id },
    include: {
      cart_items: {
        include: {
          products: {
            include: {
              brands: true,
            },
          },
        },
      },
    },
  });

  // 🔥 kalau cart belum ada
  if (!cart) {
    return NextResponse.json({
      cart_items: [],
    });
  }

  return NextResponse.json(cart);
}

//
// 🔥 POST → tambah ke cart
//
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, product_id, quantity } = body;

    if (!user_id || !product_id) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // 🔥 cari cart
    let cart = await prisma.carts.findFirst({
      where: { user_id },
    });

    // 🔥 kalau belum ada → buat
    if (!cart) {
      cart = await prisma.carts.create({
        data: { user_id },
      });
    }

    // 🔥 cek item sudah ada
    const existingItem = await prisma.cart_items.findFirst({
      where: {
        cart_id: cart.id,
        product_id,
      },
    });

    if (existingItem) {
      await prisma.cart_items.update({
        where: { id: existingItem.id },
        data: {
          quantity: (existingItem.quantity || 0) + (quantity || 1),
        },
      });
    } else {
      await prisma.cart_items.create({
        data: {
          cart_id: cart.id,
          product_id,
          quantity: quantity || 1,
        },
      });
    }

    // 🔥 return cart terbaru
    const updatedCart = await prisma.carts.findFirst({
      where: { user_id },
      include: {
        cart_items: {
          include: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal tambah cart" },
      { status: 500 }
    );
  }
}

//
// 🔥 PUT → update quantity
//
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { item_id, quantity } = body;

    if (!item_id) {
      return NextResponse.json(
        { error: "Item tidak ditemukan" },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: "Quantity minimal 1" },
        { status: 400 }
      );
    }

    await prisma.cart_items.update({
      where: { id: item_id },
      data: { quantity },
    });

    return NextResponse.json({
      message: "Quantity berhasil diupdate",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal update quantity" },
      { status: 500 }
    );
  }
}

//
// 🔥 DELETE → hapus item
//
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { item_id } = body;

    if (!item_id) {
      return NextResponse.json(
        { error: "Item tidak ditemukan" },
        { status: 400 }
      );
    }

    await prisma.cart_items.delete({
      where: { id: item_id },
    });

    return NextResponse.json({
      message: "Item berhasil dihapus",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Item tidak ditemukan" },
      { status: 404 }
    );
  }
}