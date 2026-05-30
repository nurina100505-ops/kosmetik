import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, username, email, password } = body;

    // ================= VALIDASI =================
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // optional: rapikan input (biar gak ada spasi aneh)
    const cleanName = name.trim();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    // ================= CEK DUPLIKAT =================
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { username: cleanUsername }
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email atau Username sudah terdaftar" },
        { status: 400 }
      );
    }

    // ================= HASH PASSWORD =================
    const hashedPassword = await bcrypt.hash(password, 10);

    // ================= SIMPAN USER =================
    const user = await prisma.users.create({
      data: {
        name: cleanName,
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        role: "customer", // default role
      },
    });

    return NextResponse.json(
      {
        message: "Register berhasil",
        user,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}