import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      user_id,
      receiver_name,
      phone,
      address,
      shipping_method,
      shipping_cost,
      total_price,
      payment_proof,
      cartItems
    } = body;

    // 🔥 VALIDASI
    if (!user_id || !receiver_name || !phone || !address) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { message: "Keranjang kosong" },
        { status: 400 }
      );
    }

    // 🔥 BUAT ORDER
    const order = await prisma.orders.create({
      data: {
        user_id,
        receiver_name,
        phone,
        address,
        shipping_method,
        total_price,
        payment_proof,
        status: "pending"
      }
    });

    // 🔥 MASUKKAN ITEM
    for (const item of cartItems) {
      await prisma.order_items.create({
        data: {
          order_id: order.id,
          product_id: item.product_id || item.id,
          quantity: item.quantity,
          price: item.price
        }
      });
    }

    // 🔥 OPTIONAL: CLEAR CART (biar gak dobel)
    await prisma.cart_items.deleteMany({
      where: {
        carts: {
          user_id: user_id
        }
      }
    });

    return NextResponse.json({
      message: "Order berhasil dibuat",
      order
    });

 } catch (error: any) {
  console.error("CHECKOUT ERROR:", error);

  return NextResponse.json(
    {
      message: "Terjadi error",
      error: error.message,
    },
    { status: 500 }
  );
}
}