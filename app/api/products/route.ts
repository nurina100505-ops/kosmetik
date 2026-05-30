import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// ================= GET PRODUCTS =================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const brand = searchParams.get("brand");
    const category = searchParams.get("category");

    const products = await prisma.products.findMany({
      where: {
        ...(brand && {
          brands: {
            name: {
              equals: brand,
            },
          },
        }),

        ...(category && {
          categories: {
            name: {
              equals: category,
            },
          },
        }),
      },

      include: {
        categories: true,
        brands: true,
      },

      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(products);

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Gagal mengambil produk" },
      { status: 500 }
    );
  }
}

// ================= CREATE PRODUCT =================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      description,
      price,
      stock,
      image,
      category_name,
      brand_name,
      is_recommended,
    } = body;

    // ================= CATEGORY =================
    let category = await prisma.categories.findFirst({
      where: {
        name: category_name,
      },
    });

    if (!category) {
      category = await prisma.categories.create({
        data: {
          name: category_name,
        },
      });
    }

    // ================= BRAND =================
    let brand = await prisma.brands.findFirst({
      where: {
        name: brand_name,
      },
    });

    if (!brand) {
      brand = await prisma.brands.create({
        data: {
          name: brand_name,
        },
      });
    }

    // ================= CREATE PRODUCT =================
    const product = await prisma.products.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        image,
        category_id: category.id,
        brand_id: brand.id,
        is_recommended: Boolean(is_recommended),
      },
    });

    return NextResponse.json(product);

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Gagal tambah produk" },
      { status: 500 }
    );
  }
}

// ================= UPDATE PRODUCT =================
export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    let categoryId;
    let brandId;

    // ================= CATEGORY =================
    if (body.category_name) {

      let category = await prisma.categories.findFirst({
        where: {
          name: body.category_name,
        },
      });

      if (!category) {
        category = await prisma.categories.create({
          data: {
            name: body.category_name,
          },
        });
      }

      categoryId = category.id;
    }

    // ================= BRAND =================
    if (body.brand_name) {

      let brand = await prisma.brands.findFirst({
        where: {
          name: body.brand_name,
        },
      });

      if (!brand) {
        brand = await prisma.brands.create({
          data: {
            name: body.brand_name,
          },
        });
      }

      brandId = brand.id;
    }

    const product = await prisma.products.update({
      where: {
        id: Number(body.id),
      },

      data: {
        name:
          body.name !== undefined
            ? body.name
            : undefined,

        description:
          body.description !== undefined
            ? body.description
            : undefined,

        price:
          body.price !== undefined
            ? Number(body.price)
            : undefined,

        stock:
          body.stock !== undefined
            ? Number(body.stock)
            : undefined,

        image:
          body.image !== undefined
            ? body.image
            : undefined,

        is_recommended:
          body.is_recommended !== undefined
            ? Boolean(body.is_recommended)
            : undefined,

        category_id: categoryId,
        brand_id: brandId,
      },
    });

    return NextResponse.json(product);

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Gagal update produk" },
      { status: 500 }
    );
  }
}

// ================= DELETE PRODUCT =================
export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    await prisma.products.delete({
      where: {
        id: Number(body.id),
      },
    });

    return NextResponse.json({
      message: "Produk berhasil dihapus",
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Gagal hapus produk" },
      { status: 500 }
    );
  }
}