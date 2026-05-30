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

  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");

  // ================= FETCH =================
  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/pelanggan");

      const data = await res.json();

      if (Array.isArray(data)) {
        setCustomers(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ================= FILTER =================
  const filteredCustomers = customers.filter((c) => {

  const keyword =
    search.toLowerCase();

  const cocokNama =
    (c.name || "")
      .toLowerCase()
      .includes(keyword);

  const cocokEmail =
    (c.email || "")
      .toLowerCase()
      .includes(keyword);

  const cocokPhone =
    (c.phone || "")
      .toLowerCase()
      .includes(keyword);

  const cocokSearch =
    cocokNama ||
    cocokEmail ||
    cocokPhone;

  const status =
    c.status || "Selesai";

  if (filter === "Semua") {
    return cocokSearch;
  }

  return (
    cocokSearch &&
    status.toLowerCase() ===
      filter.toLowerCase()
  );
});

  return (
    <div className="flex min-h-screen bg-[#FFF8FC]">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-20 bg-[#BA88AE] flex flex-col items-center py-5 gap-4 shadow-lg">

        {menus.map((item, i) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

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
            Daftar Pelanggan
          </h1>

          <p className="text-[#7B4364] mt-1">
            Kelola data pelanggan
            toko Mery House
            Galery ✨
          </p>

        </div>

        {/* ================= SEARCH & FILTER ================= */}
        <div className="bg-white border border-[#F3CCDE] rounded-[26px] p-5 shadow-sm mb-6">

          <div className="flex flex-col md:flex-row gap-4">

            {/* SEARCH */}
            <div className="flex items-center flex-1 bg-[#FFF8FC] border border-[#F3CCDE] rounded-2xl px-4 py-3">

              <Search
                size={16}
                className="text-[#BA88AE]"
              />

              <input
                type="text"
                placeholder="Cari pelanggan..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="ml-3 w-full bg-transparent outline-none text-sm text-[#7B4364] placeholder:text-[#C59AB7]"
              />

            </div>

            {/* FILTER */}
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              className="bg-[#FFF8FC] border border-[#F3CCDE] rounded-2xl px-4 py-3 text-sm text-[#7B4364] outline-none"
            >
              <option value="Semua">
                Semua
              </option>

              <option value="Proses">
                Proses
              </option>

              <option value="Dikirim">
                Dikirim
              </option>

              <option value="Selesai">
                Selesai
              </option>

            </select>

          </div>

        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white border border-[#F3CCDE] rounded-[28px] shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              {/* HEADER */}
              <thead className="bg-[#FCEEF5]">

                <tr className="text-[#BA88AE] text-sm">

                  <th className="p-4 text-left border-b border-r border-[#F3CCDE]">
                    ID
                  </th>

                  <th className="p-4 text-left border-b border-r border-[#F3CCDE]">
                    Nama
                  </th>

                  <th className="p-4 text-left border-b border-r border-[#F3CCDE]">
                    Email
                  </th>

                  <th className="p-4 text-left border-b border-r border-[#F3CCDE]">
                    No. HP
                  </th>

                  <th className="p-4 text-left border-b border-r border-[#F3CCDE]">
                    Status
                  </th>

                  <th className="p-4 text-left border-b border-[#F3CCDE]">
                    Bergabung
                  </th>

                </tr>

              </thead>

              {/* BODY */}
              <tbody>

                {filteredCustomers.length >
                0 ? (
                  filteredCustomers.map(
                    (c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-[#FFF8FC] transition"
                      >

                        {/* ID */}
                        <td className="p-4 border-b border-r border-[#F3CCDE] text-[#7B4364] text-sm">
                          #{c.id}
                        </td>

                        {/* NAMA */}
                        <td className="p-4 border-b border-r border-[#F3CCDE]">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-[#F3CCDE] flex items-center justify-center text-[#BA88AE] font-semibold text-sm">
                              {c.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </div>

                            <div>

                              <p className="font-semibold text-[#7B4364] text-sm">
                                {c.name}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* EMAIL */}
                        <td className="p-4 border-b border-r border-[#F3CCDE] text-[#7B4364] text-sm">
                          {c.email}
                        </td>

                        {/* PHONE */}
                        <td className="p-4 border-b border-r border-[#F3CCDE] text-[#7B4364] text-sm">
                          {c.phone || "-"}
                        </td>

                        {/* STATUS */}
                        <td className="p-4 border-b border-r border-[#F3CCDE]">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium
                            ${
                              (c.status || "Selesai") ===
                              "Proses"
                                ? "bg-yellow-100 text-yellow-700"
                                : (c.status || "Selesai") ===
                                  "Dikirim"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {c.status || "Selesai"}
                          </span>

                        </td>

                        {/* DATE */}
                        <td className="p-4 border-b border-[#F3CCDE] text-[#7B4364] text-sm">

                          {new Date(
                            c.created_at
                          ).toLocaleDateString(
                            "id-ID"
                          )}

                        </td>

                      </tr>
                    )
                  )
                ) : (
                  <tr>

                    <td
                      colSpan={6}
                      className="p-8 text-center text-[#BA88AE]"
                    >
                      Data pelanggan
                      tidak ditemukan
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