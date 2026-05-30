"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  LayoutGrid,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  FileText,
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    href: "/pemilik/dashboard",
    icon: LayoutGrid,
  },
  {
    name: "Kelola Produk",
    href: "/pemilik/kelolaproduk",
    icon: Package,
  },
  {
    name: "Pesanan",
    href: "/pemilik/pesanan",
    icon: ShoppingCart,
  },
  {
    name: "Pelanggan",
    href: "/pemilik/pelanggan",
    icon: Users,
  },
  {
    name: "Laporan",
    href: "/pemilik/laporan",
    icon: BarChart3,
  },
  {
    name: "Artikel Tutorial",
    href: "/pemilik/artikeltutorial",
    icon: FileText,
  },
];

export default function Page() {
  const pathname = usePathname();

  const [data, setData] =
    useState<any>(null);

  // ================= FETCH =================
  const fetchLaporan =
    async () => {
      try {
        const res =
          await fetch(
            "/api/laporan"
          );

        const result =
          await res.json();

        setData(result);
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    fetchLaporan();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FFF8FC]">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-20 bg-[#BA88AE] flex flex-col items-center py-5 gap-4 shadow-lg">

        {menus.map((item, i) => {
          const Icon =
            item.icon;

          const active =
            pathname ===
            item.href;

          return (
            <Link
              key={i}
              href={item.href}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                active
                  ? "bg-white text-[#BA88AE] shadow-md"
                  : "text-white hover:bg-[#C998BE]"
              }`}
            >
              <Icon size={18} />
            </Link>
          );
        })}

      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8">

        {/* ================= HEADER ================= */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-[#BA88AE]">
            Laporan Toko
          </h1>

          <p className="text-[#7B4364] mt-1">
            Statistik dan ringkasan
            toko Mery House
            Galery ✨
          </p>

        </div>

        {/* ================= CARD ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <Card
            title="Total Produk"
            value={
              data?.totalProducts ||
              0
            }
          />

          <Card
            title="Total Pelanggan"
            value={
              data?.totalCustomers ||
              0
            }
          />

          <Card
            title="Total Pesanan"
            value={
              data?.totalOrders ||
              0
            }
          />

          <Card
            title="Total Pendapatan"
            value={`Rp ${Number(
              data?.totalRevenue ||
                0
            ).toLocaleString(
              "id-ID"
            )}`}
          />

        </div>

        {/* ================= TABEL ================= */}
        <div className="bg-white border border-[#F3CCDE] rounded-[28px] shadow-sm overflow-hidden">

          {/* HEADER TABEL */}
          <div className="p-6 border-b border-[#F3CCDE] bg-[#FFF8FC]">

            <h2 className="text-xl font-bold text-[#BA88AE]">

              Pesanan Terbaru

            </h2>

            <p className="text-sm text-[#7B4364] mt-1">

              Daftar transaksi
              terbaru pelanggan

            </p>

          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead className="bg-[#FCEEF5]">

                <tr className="text-[#BA88AE] text-sm">

                  <th className="p-4 text-left border-b border-r border-[#F3CCDE]">
                    ID Pesanan
                  </th>

                  <th className="p-4 text-left border-b border-r border-[#F3CCDE]">
                    Nama Pelanggan
                  </th>

                  <th className="p-4 text-left border-b border-r border-[#F3CCDE]">
                    Total Belanja
                  </th>

                  <th className="p-4 text-left border-b border-r border-[#F3CCDE]">
                    Status
                  </th>

                  <th className="p-4 text-left border-b border-[#F3CCDE]">
                    Tanggal
                  </th>

                </tr>

              </thead>

              <tbody>

                {data?.latestOrders
                  ?.length > 0 ? (
                  data.latestOrders.map(
                    (o: any) => (
                      <tr
                        key={o.id}
                        className="hover:bg-[#FFF8FC] transition"
                      >

                        {/* ID */}
                        <td className="p-4 border-b border-r border-[#F3CCDE] text-[#7B4364] text-sm font-medium">
                          #{o.id}
                        </td>

                        {/* PELANGGAN */}
                        <td className="p-4 border-b border-r border-[#F3CCDE]">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-[#F3CCDE] flex items-center justify-center text-[#BA88AE] font-semibold text-sm">

                              {o.users?.name
                                ?.charAt(
                                  0
                                )
                                ?.toUpperCase()}

                            </div>

                            <div>

                              <p className="font-semibold text-[#7B4364] text-sm">

                                {
                                  o.users
                                    ?.name
                                }

                              </p>

                            </div>

                          </div>

                        </td>

                        {/* TOTAL */}
                        <td className="p-4 border-b border-r border-[#F3CCDE] text-[#BA88AE] font-semibold text-sm">

                          Rp{" "}
                          {Number(
                            o.total_price
                          ).toLocaleString(
                            "id-ID"
                          )}

                        </td>

                        {/* STATUS */}
                        <td className="p-4 border-b border-r border-[#F3CCDE]">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium
                            ${
                              o.status ===
                              "proses"
                                ? "bg-yellow-100 text-yellow-700"
                                : o.status ===
                                  "dikirim"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {o.status ===
                            "proses"
                              ? "Diproses"
                              : o.status ===
                                "dikirim"
                              ? "Dikirim"
                              : "Selesai"}
                          </span>

                        </td>

                        {/* TANGGAL */}
                        <td className="p-4 border-b border-[#F3CCDE] text-[#7B4364] text-sm">

                          {new Date(
                            o.created_at
                          ).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month:
                                "long",
                              year:
                                "numeric",
                            }
                          )}

                        </td>

                      </tr>
                    )
                  )
                ) : (
                  <tr>

                    <td
                      colSpan={5}
                      className="p-10 text-center text-[#BA88AE]"
                    >
                      Belum ada data
                      pesanan
                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}

// ================= CARD =================
function Card({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="bg-white border border-[#F3CCDE] rounded-[28px] p-6 shadow-sm hover:shadow-md transition">

      <p className="text-sm text-[#7B4364] font-medium">

        {title}

      </p>

      <h2 className="text-3xl font-bold text-[#BA88AE] mt-3">

        {value}

      </h2>

    </div>
  );
}