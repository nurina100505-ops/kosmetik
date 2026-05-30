import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { createToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // 🔥 VALIDASI
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    // 🔥 CARI USER BERDASARKAN USERNAME
    const user = await prisma.users.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // 🔥 CEK PASSWORD
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Password salah" },
        { status: 401 }
      );
    }

    // 🔥 BUAT TOKEN
    const token = createToken({
      id: user.id,
      role: user.role,
    });

    return NextResponse.json({
      message: "Login berhasil",
      token,
      user,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}