import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma as db } from "@/lib/db"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const admin = await db.admins.findFirst({
      where: { email: email },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Email salah" },
        { status: 400 }
      );
    }

    // PAKAI PENGAWAL ?? "" DI SINI
   // CARA PALING GAMPANG: Cek password tanpa Bcrypt
// Bandingkan teks langsung (admin123 == admin123)
const isMatch = password === admin.password; 

if (!isMatch) {
  return NextResponse.json(
    { message: "Password salah" },
    { status: 400 }
  );
}

    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      data: {
        id: admin.id,
        email: admin.email
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}