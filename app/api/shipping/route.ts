import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type");

    // ===========================
    // 🔥 AMBIL KOTA
    // ===========================
    if (type === "kota") {
      const provinsi_id = searchParams.get("provinsi_id");

      if (!provinsi_id) {
        return NextResponse.json(
          { error: "provinsi_id wajib diisi" },
          { status: 400 }
        );
      }

      const res = await fetch(
        `https://api.binderbyte.com/wilayah/kabupaten?api_key=${process.env.BINDERBYTE_API_KEY}&id_provinsi=${provinsi_id}`
      );

      const data = await res.json();

      return NextResponse.json(data.value || []);
    }

    // ===========================
    // 🔥 HITUNG ONGKIR
    // ===========================
    if (type === "ongkir") {
      const origin = searchParams.get("origin");
      const destination = searchParams.get("destination");
      const weight = searchParams.get("weight");

      if (!origin || !destination || !weight) {
        return NextResponse.json(
          { error: "origin, destination, weight wajib diisi" },
          { status: 400 }
        );
      }

      const res = await fetch(
        `https://api.binderbyte.com/v1/cost?api_key=${process.env.BINDERBYTE_API_KEY}&courier=jnt&origin=${origin}&destination=${destination}&weight=${weight}`
      );

      const data = await res.json();

      return NextResponse.json(data.value || []);
    }

    // ===========================
    // ❌ TYPE SALAH
    // ===========================
    return NextResponse.json(
      { error: "type tidak valid" },
      { status: 400 }
    );

  } catch (error) {
    console.error("ERROR SHIPPING:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}