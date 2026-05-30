import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    const pelanggan = await prisma.users.findMany({
      where: {
        role: "customer",
      },

      orderBy: {
        created_at: "desc",
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        created_at: true,
      },
    });

    return NextResponse.json(pelanggan);

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Gagal mengambil pelanggan" },
      { status: 500 }
    );
  }
}