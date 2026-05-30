import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // CARD
    const totalProduk = await prisma.products.count();

    const pesananBaru = await prisma.orders.count({
      where: {
        status: "pending",
      },
    });

    const pelangganAktif = await prisma.users.count({
      where: {
        role: "customer",
      },
    });

    const penjualan = await prisma.orders.aggregate({
      _sum: {
        total_price: true,
      },
      where: {
        status: "completed",
      },
    });

    // GRAFIK PENJUALAN
    const orders = await prisma.orders.findMany({
      where: {
        status: "completed",
      },
      select: {
        total_price: true,
        created_at: true,
      },
    });

    const bulanMap = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    const grafik = Array.from({ length: 12 }, (_, i) => ({
      bulan: bulanMap[i],
      total: 0,
    }));

    orders.forEach((order) => {
      const bulan = new Date(order.created_at).getMonth();

      grafik[bulan].total += order.total_price || 0;
    });

    // PRODUK TERLARIS
    const produkTerlaris = await prisma.order_items.groupBy({
      by: ["product_id"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    });

    const produkIds = produkTerlaris.map(
      (item) => item.product_id
    );

    const produkData = await prisma.products.findMany({
      where: {
        id: {
          in: produkIds as number[],
        },
      },
    });

    const produkTerlarisFix = produkTerlaris.map((item) => {
      const produk = produkData.find(
        (p) => p.id === item.product_id
      );

      return {
        nama: produk?.name,
        totalTerjual: item._sum.quantity,
      };
    });

    // PESANAN TERBARU
    const pesananTerbaru = await prisma.orders.findMany({
      take: 5,
      orderBy: {
        created_at: "desc",
      },
      include: {
        users: true,
      },
    });

    // ARTIKEL
    const artikel = await prisma.articles.findMany({
      take: 5,
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json({
      totalProduk,
      pesananBaru,
      pelangganAktif,
      totalPenjualan: penjualan._sum.total_price || 0,
      grafik,
      produkTerlaris: produkTerlarisFix,
      pesananTerbaru,
      artikel,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan",
      },
      {
        status: 500,
      }
    );
  }
}