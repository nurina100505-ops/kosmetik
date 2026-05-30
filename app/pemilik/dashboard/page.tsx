"use client";

import Link from "next/link";

import Image from "next/image";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import {
  LayoutGrid,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  FileText,
  LogOut,
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

type DashboardData = {
  totalProduk: number;
  pesananBaru: number;
  pelangganAktif: number;
  totalPenjualan: number;
  grafik: any[];
  produkTerlaris: any[];
  pesananTerbaru: any[];
  artikel: any[];
};

export default function Page() {

  const pathname =
    usePathname();

  const router =
    useRouter();

  const [open, setOpen] =
    useState(false);

  const [data, setData] =
    useState<DashboardData>({
      totalProduk: 0,
      pesananBaru: 0,
      pelangganAktif: 0,
      totalPenjualan: 0,
      grafik: [],
      produkTerlaris: [],
      pesananTerbaru: [],
      artikel: [],
    });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const getDashboard =
      async () => {

        try {

          const res =
            await fetch(
              "/api/dashboardpemilik"
            );

          const result =
            await res.json();

          setData({
            totalProduk:
              result?.totalProduk || 0,

            pesananBaru:
              result?.pesananBaru || 0,

            pelangganAktif:
              result?.pelangganAktif || 0,

            totalPenjualan:
              result?.totalPenjualan || 0,

            grafik: Array.isArray(
              result?.grafik
            )
              ? result.grafik
              : [],

            produkTerlaris:
              Array.isArray(
                result?.produkTerlaris
              )
                ? result.produkTerlaris
                : [],

            pesananTerbaru:
              Array.isArray(
                result?.pesananTerbaru
              )
                ? result.pesananTerbaru
                : [],

            artikel: Array.isArray(
              result?.artikel
            )
              ? result.artikel
              : [],
          });

        } catch (error) {

          console.log(
            "Gagal mengambil dashboard:",
            error
          );

        } finally {

          setLoading(false);

        }
      };

    getDashboard();

  }, []);

  const formatRupiah = (
    num: number
  ) => {

    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }
    ).format(num);
  };

  const grafik =
    Array.isArray(
      data?.grafik
    )
      ? data.grafik
      : [];

  const maxGrafik =
    grafik.length > 0
      ? Math.max(
          ...grafik.map(
            (item: any) =>
              Number(item.total) || 0
          )
        )
      : 0;

  // ================= LOGOUT =================
  const logout = () => {

    router.push(
      "/pemilik/login"
    );
  };

  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-screen bg-[#FFF8FC]">

        <p className="text-[#7B4364] text-lg">
          Memuat dashboard...
        </p>

      </div>

    );
  }

  return (

    <div className="flex min-h-screen bg-[#FFF8FC]">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-20 bg-[#BA88AE] flex flex-col items-center py-5 gap-4 shadow-xl">

        {/* MENU */}
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
                  ? "bg-white text-[#BA88AE] shadow-lg scale-105"
                  : "text-white hover:bg-[#C998BE]"
              }`}
            >

              <Icon size={20} />

            </Link>

          );
        })}

      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8">

        {/* ================= TOPBAR ================= */}
        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-3xl font-bold text-[#BA88AE]">
              Dashboard Admin
            </h1>

            <p className="text-[#7B4364] mt-1">
              Selamat datang kembali di
              Mery House Galery ✨
            </p>

          </div>

          {/* ================= ADMIN LOGO ================= */}
          <div className="relative">

            <div
              onClick={() =>
                setOpen(!open)
              }
              className="w-11 h-11 rounded-full overflow-hidden cursor-pointer shadow-md hover:scale-105 transition border-2 border-[#F3CCDE] bg-white"
            >

              <Image
                src="/ww.png"
                alt="Admin"
                width={44}
                height={44}
                className="object-cover w-full h-full"
              />

            </div>

            {/* ================= DROPDOWN ================= */}
            {open && (

              <div className="absolute right-0 mt-3 w-40 bg-white border border-[#F3CCDE] rounded-2xl shadow-xl overflow-hidden z-50">

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[#7B4364] hover:bg-[#FFF0F7] transition font-medium"
                >

                  <LogOut size={16} />

                  Keluar

                </button>

              </div>

            )}

          </div>

        </div>

        {/* ================= WELCOME ================= */}
        <div className="bg-white border border-[#F3CCDE] rounded-[28px] p-6 shadow-md mb-8">

          <h2 className="font-bold text-2xl text-[#BA88AE]">
            Ringkasan Toko
          </h2>

          <p className="text-[#7B4364] mt-2">
            Pantau penjualan,
            produk, pelanggan,
            dan aktivitas toko
            secara real-time.
          </p>

        </div>

        {/* ================= CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <Card
            title="Total Produk"
            value={data.totalProduk.toString()}
          />

          <Card
            title="Pesanan Baru"
            value={data.pesananBaru.toString()}
          />

          <Card
            title="Pelanggan Aktif"
            value={data.pelangganAktif.toString()}
          />

          <Card
            title="Total Penjualan"
            value={formatRupiah(
              data.totalPenjualan
            )}
          />

        </div>

        {/* ================= CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ================= GRAFIK ================= */}
          <div className="lg:col-span-2 bg-white border border-[#F3CCDE] rounded-[28px] p-6 shadow-md">

            <h3 className="font-bold text-xl text-[#BA88AE] mb-6">
              Laporan Penjualan
            </h3>

            <div className="flex items-end justify-between h-64 gap-4">

              {grafik.length > 0 ? (

                grafik.map(
                  (
                    item: any,
                    i: number
                  ) => {

                    const tinggi =
                      maxGrafik > 0
                        ? (item.total /
                            maxGrafik) *
                          100
                        : 5;

                    return (

                      <div
                        key={i}
                        className="flex flex-col items-center w-full"
                      >

                        <div className="w-full flex items-end h-52">

                          <div
                            className="bg-[#BA88AE] hover:bg-[#A96D98] transition-all rounded-t-2xl w-full"
                            style={{
                              height: `${tinggi}%`,
                            }}
                          />

                        </div>

                        <span className="text-xs text-[#7B4364] mt-2">
                          {item.bulan}
                        </span>

                      </div>

                    );
                  }
                )

              ) : (

                <div className="flex items-center justify-center w-full text-[#7B4364]">

                  Belum ada data penjualan

                </div>

              )}

            </div>

          </div>

          {/* ================= PRODUK TERLARIS ================= */}
          <div className="bg-white border border-[#F3CCDE] rounded-[28px] p-6 shadow-md">

            <h3 className="font-bold text-xl text-[#BA88AE] mb-5">
              Produk Terlaris
            </h3>

            <ul className="space-y-4 text-sm">

              {data.produkTerlaris.length >
              0 ? (

                data.produkTerlaris.map(
                  (
                    item: any,
                    index: number
                  ) => (

                    <li
                      key={index}
                      className="flex justify-between border-b border-[#F3CCDE] pb-3"
                    >

                      <span className="text-[#7B4364]">
                        {item.nama}
                      </span>

                      <span className="font-bold text-[#BA88AE]">
                        {item.totalTerjual}
                      </span>

                    </li>

                  )
                )

              ) : (

                <li className="text-[#7B4364]">
                  Tidak ada data
                </li>

              )}

            </ul>

          </div>

        </div>

      </main>

    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {

  return (

    <div className="bg-white border border-[#F3CCDE] rounded-[24px] p-5 shadow-md hover:shadow-xl transition">

      <p className="text-[#7B4364] text-sm font-medium">
        {title}
      </p>

      <h3 className="text-2xl font-bold mt-3 text-[#BA88AE]">
        {value}
      </h3>

    </div>

  );
}