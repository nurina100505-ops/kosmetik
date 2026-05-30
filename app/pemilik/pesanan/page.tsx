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
  Search,
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

  const [orders, setOrders] =
    useState<any[]>([]);

  // ================= FETCH DATA =================
  useEffect(() => {
    fetch("/api/pesanan?role=admin")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.error(
          "Gagal mengambil pesanan:",
          err
        );
      });
  }, []);

  // ================= FORMAT RUPIAH =================
  const formatRupiah = (
    number: number
  ) => {
    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
      }
    ).format(number);
  };

  // ================= FORMAT TANGGAL =================
  const formatDate = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ================= WARNA STATUS =================
  const getStatusColor = (
    status: string
  ) => {
    if (status === "pending")
      return "bg-[#FFF1C9] text-[#B78103] border border-[#FFE49A]";

    if (status === "paid")
      return "bg-[#E3ECFF] text-[#365BB3] border border-[#C7D9FF]";

    if (status === "shipped")
      return "bg-[#F3DDF5] text-[#9B4AA2] border border-[#E9C5ED]";

    if (status === "completed")
      return "bg-[#DDF8E7] text-[#2E8B57] border border-[#BDEBCF]";

    return "bg-gray-100 text-gray-600 border border-gray-200";
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async (
    id: number,
    status: string
  ) => {
    try {
      const res = await fetch(
        "/api/pesanan",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id,
            status,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Gagal update status"
        );
        return;
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                status,
              }
            : o
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        "Terjadi kesalahan"
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFF8FC]">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-20 bg-[#BA88AE] flex flex-col items-center py-5 gap-4 shadow-lg">

        {menus.map((item, i) => {
          const Icon = item.icon;

          const active =
            pathname ===
            item.href;

          return (
            <Link
              key={i}
              href={item.href}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                active
                  ? "bg-white text-[#BA88AE]"
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
        <div className="flex items-center justify-between mb-7">

          <div>

            <h1 className="text-4xl font-bold text-[#BA88AE]">
              Pesanan
            </h1>

            <p className="text-[#7B4364] mt-2">
              Kelola seluruh
              pesanan pelanggan
              Mery House
              Galery ✨
            </p>

          </div>

        </div>

        {/* ================= CARD ================= */}
        <div className="bg-white border border-[#F3CCDE] rounded-[30px] p-7 shadow-sm">

          {/* ================= TOP ================= */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <h2 className="text-2xl font-bold text-[#BA88AE]">
              Pesanan Pelanggan
            </h2>

            {/* SEARCH */}
            <div className="flex items-center border border-[#F3CCDE] bg-[#FFF8FC] rounded-2xl px-4 py-3 w-full md:w-[320px]">

              <Search
                size={18}
                className="text-[#BA88AE]"
              />

              <input
                type="text"
                placeholder="Cari pesanan..."
                className="ml-3 w-full bg-transparent outline-none text-sm text-[#7B4364] placeholder:text-[#B88AA8]"
              />

            </div>

          </div>

          {/* ================= TABLE ================= */}
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-[#FCEEF5] text-[#BA88AE] text-sm">

                  <th className="text-left px-6 py-5 font-semibold">
                    Invoice
                  </th>

                  <th className="text-left px-4 py-5 font-semibold">
                    Pelanggan
                  </th>

                  <th className="text-left px-4 py-5 font-semibold">
                    Tanggal
                  </th>

                  <th className="text-left px-4 py-5 font-semibold">
                    Total
                  </th>

                  <th className="text-left px-4 py-5 font-semibold">
                    Status
                  </th>

                  <th className="text-left px-4 py-5 font-semibold">
                    Produk
                  </th>

                </tr>

              </thead>

              <tbody>

                {orders.length >
                0 ? (
                  orders.map(
                    (o, i) => (

                      <tr
                        key={i}
                        className="border-t border-[#F8DDE8] hover:bg-[#FFF8FC] transition"
                      >

                        {/* INVOICE */}
                        <td className="px-6 py-5 font-semibold text-[#7B4364]">
                          INV-{o.id}
                        </td>

                        {/* PELANGGAN */}
                        <td className="px-4 py-5 text-[#7B4364] font-medium">
                          {o.users
                            ?.name ||
                            "User"}
                        </td>

                        {/* TANGGAL */}
                        <td className="px-4 py-5 text-[#7B4364]">
                          {formatDate(
                            o.created_at
                          )}
                        </td>

                        {/* TOTAL */}
                        <td className="px-4 py-5 font-semibold text-[#BA88AE]">
                          {formatRupiah(
                            o.total_price
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-5">

                          <select
                            value={
                              o.status
                            }
                            onChange={(
                              e
                            ) =>
                              updateStatus(
                                o.id,
                                e
                                  .target
                                  .value
                              )
                            }
                            className={`px-3 py-2 rounded-xl text-sm outline-none ${getStatusColor(
                              o.status
                            )}`}
                          >

                            <option value="pending">
                              Diproses
                            </option>

                            <option value="shipped">
                              Dikirim
                            </option>

                            <option value="completed">
                              Selesai
                            </option>

                          </select>

                        </td>

                        {/* PRODUK */}
                        <td className="px-4 py-5">

                          <div className="space-y-3">

                            {o.order_items?.map(
                              (
                                item: any
                              ) => (

                                <div
                                  key={
                                    item.id
                                  }
                                  className="flex items-center gap-3"
                                >

                                  <img
                                    src={
                                      item
                                        .products
                                        ?.image ||
                                      "/produk4.png"
                                    }
                                    alt=""
                                    className="w-14 h-14 object-cover rounded-2xl border border-[#F3CCDE]"
                                  />

                                  <div>

                                    <p className="font-semibold text-[#7B4364] text-sm">
                                      {
                                        item
                                          .products
                                          ?.name
                                      }
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                      {
                                        item.quantity
                                      }
                                      x
                                    </p>

                                  </div>

                                </div>

                              )
                            )}

                          </div>

                        </td>

                      </tr>

                    )
                  )
                ) : (

                  <tr>

                    <td
                      colSpan={6}
                      className="text-center py-10 text-[#B88AA8]"
                    >
                      Belum ada
                      pesanan
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* ================= FOOTER ================= */}
          <div className="mt-6 text-sm text-[#7B4364]">

            Total Pesanan :
            <span className="font-semibold text-[#BA88AE] ml-1">
              {orders.length}
            </span>

          </div>

        </div>

      </main>

    </div>
  );
}