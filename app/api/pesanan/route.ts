import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// 🔥 GET PESANAN
export async function GET(req: Request) {
  try {

    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("user_id");
    const role = searchParams.get("role");

    let orders;

    // 🔥 ADMIN / PEMILIK
    if (role === "admin") {

      orders = await prisma.orders.findMany({

        include: {

          users: true,

          order_items: {
            include: {
              products: true,
            },
          },

        },

        orderBy: {
          created_at: "desc",
        },

      });

    }

    // 🔥 PELANGGAN
    else {

      if (!userId) {

        return NextResponse.json(
          { error: "User tidak ditemukan" },
          { status: 400 }
        );

      }

      orders = await prisma.orders.findMany({

        where: {
          user_id: Number(userId),
        },

        include: {

          order_items: {
            include: {
              products: true,
            },
          },

        },

        orderBy: {
          created_at: "desc",
        },

      });

    }

    return NextResponse.json(orders);

  } catch (error) {

    console.error("PESANAN ERROR:", error);

    return NextResponse.json(
      { error: "Gagal mengambil pesanan" },
      { status: 500 }
    );

  }
}

// 🔥 UPDATE STATUS PESANAN
export async function PUT(req: Request) {
  try {

    const body = await req.json();

    const { id, status } = body;

    // 🔥 validasi
    if (!id || !status) {

      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );

    }

    // 🔥 update database
    const order = await prisma.orders.update({

      where: {
        id: Number(id),
      },

      data: {
        status,
      },

    });

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (error) {

    console.error("UPDATE STATUS ERROR:", error);

    return NextResponse.json(
      { error: "Gagal update status" },
      { status: 500 }
    );

  }
}