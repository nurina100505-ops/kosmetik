import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// ================= GET =================
export async function GET() {
  try {
    const articles = await prisma.articles.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(articles);

  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil artikel" },
      { status: 500 }
    );
  }
}

// ================= POST =================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const article = await prisma.articles.create({
      data: {
        title: body.title,
        content: body.content,
        image: body.image,
        category: body.category,
      },
    });

    return NextResponse.json(article);

  } catch (error) {
    return NextResponse.json(
      { error: "Gagal tambah artikel" },
      { status: 500 }
    );
  }
}

// ================= DELETE =================
export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    await prisma.articles.delete({
      where: {
        id: Number(body.id),
      },
    });

    return NextResponse.json({
      message: "Artikel berhasil dihapus",
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Gagal hapus artikel" },
      { status: 500 }
    );
  }
}