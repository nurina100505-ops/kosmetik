import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    // TOTAL PRODUK
    const totalProducts =
      await prisma.products.count();

    // TOTAL PELANGGAN
    const totalCustomers =
      await prisma.users.count({
        where: {
          role: "customer",
        },
      });

    // TOTAL PESANAN
    const totalOrders =
      await prisma.orders.count();

    // TOTAL PENDAPATAN
    const orders = await prisma.orders.findMany();

    const totalRevenue = orders.reduce(
      (acc, item) =>
        acc + (item.total_price || 0),
      0
    );

    // PESANAN TERBARU
    const latestOrders =
      await prisma.orders.findMany({
        include: {
          users: true,
        },

        orderBy: {
          created_at: "desc",
        },

        take: 5,
      });

    return NextResponse.json({
      totalProducts,
      totalCustomers,
      totalOrders,
      totalRevenue,
      latestOrders,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Gagal mengambil laporan" },
      { status: 500 }
    );
  }
}