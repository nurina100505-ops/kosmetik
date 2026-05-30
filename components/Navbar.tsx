"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

export default function Navbar() {

  const pathname = usePathname();
  const router = useRouter();

  // ================= HIDE NAVBAR =================
  if (pathname.startsWith("/pemilik")) {
    return null;
  }

  // ================= STATE =================
  const [user, setUser] = useState<any>(null);

  const [open, setOpen] =
    useState(false);

  const [jumlahPesanan,
    setJumlahPesanan] = useState(0);

  const [jumlahKeranjang,
    setJumlahKeranjang] = useState(0);

  const [search, setSearch] =
    useState("");

  // ================= FETCH DATA =================
  useEffect(() => {

    const fetchData = async () => {

      const data =
        localStorage.getItem("user");

      // 🔥 kalau belum login
      if (!data) {

        setUser(null);
        setJumlahKeranjang(0);
        setJumlahPesanan(0);

        return;
      }

      const parsed = JSON.parse(data);

      setUser(parsed);

      try {

        // ================= PESANAN =================
        const pesananRes = await fetch(
          `/api/pesanan?user_id=${parsed.id}`
        );

        const pesananData =
          await pesananRes.json();

        if (
          Array.isArray(pesananData)
        ) {

          setJumlahPesanan(
            pesananData.length
          );

        } else {

          setJumlahPesanan(0);

        }

        // ================= CART =================
        const cartRes = await fetch(
          `/api/cart?user_id=${parsed.id}`
        );

        const cartData =
          await cartRes.json();

        // 🔥 API CART kamu return OBJECT
        if (
          cartData?.cart_items
        ) {

          const totalQty =
            cartData.cart_items.reduce(
              (
                acc: number,
                item: any
              ) =>
                acc +
                (item.quantity || 0),
              0
            );

          setJumlahKeranjang(
            totalQty
          );

        } else {

          setJumlahKeranjang(0);

        }

      } catch (error) {

        console.log(error);

      }
    };

    // ================= LOAD PERTAMA =================
    fetchData();

    // ================= AUTO UPDATE =================
    const interval =
      setInterval(() => {

        fetchData();

      }, 1000);

    // ================= EVENT CART =================
    window.addEventListener(
      "cartUpdated",
      fetchData
    );

    // ================= CLEANUP =================
    return () => {

      clearInterval(interval);

      window.removeEventListener(
        "cartUpdated",
        fetchData
      );

    };

  }, []);

  // ================= LOGOUT =================
  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.href = "/";
  };

  // ================= SEARCH =================
  const handleSearch = (
    e: any
  ) => {

    e.preventDefault();

    if (!search.trim()) return;

    router.push(
      `/products?search=${search}`
    );
  };

  return (

    <nav className="bg-[#BA88AE] text-white sticky top-0 z-50 shadow-md">

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-5">

        {/* ================= LOGO ================= */}
        <Link
          href="/"
          className="flex items-center gap-3"
        >

          {/* IMAGE */}
          <div className="relative w-11 h-11 md:w-12 md:h-12">

            <Image
              src="/logo.png"
              alt="logo"
              fill
              className="object-contain"
            />

          </div>

          {/* TEXT */}
          <h1 className="text-lg md:text-xl font-bold tracking-wide whitespace-nowrap">
            MERY HOUSE GALERY
          </h1>

        </Link>

        {/* ================= MENU ================= */}
        <div className="hidden md:flex bg-[#C998BE] px-6 py-2 rounded-full gap-6 items-center shadow-sm">

          <Link
            href="/"
            className="hover:text-pink-100 transition font-medium"
          >
            Beranda
          </Link>

          <Link
            href="/#about"
            className="hover:text-pink-100 transition font-medium"
          >
            Tentang Kami
          </Link>

          <Link
            href="/artikeltutorial"
            className="hover:text-pink-100 transition font-medium"
          >
            Tips Kecantikan
          </Link>

        </div>

        {/* ================= SEARCH ================= */}
        <form
          onSubmit={handleSearch}
          className="hidden lg:flex flex-1 justify-center"
        >

          <div className="w-full max-w-md flex items-center bg-white rounded-full overflow-hidden shadow">

            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full px-4 py-2 text-gray-700 text-sm focus:outline-none"
            />

            <button
              type="submit"
              className="bg-[#BA88AE] hover:bg-[#A96D98] px-4 py-2 transition"
            >
              🔍
            </button>

          </div>

        </form>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-4 md:gap-5">

          {/* ================= PESANAN ================= */}
          <Link
            href="/pesanan"
            className="relative text-2xl hover:scale-110 transition"
          >

            📦

            {jumlahPesanan > 0 && (

              <span className="absolute -top-2 -right-3 bg-white text-[#BA88AE] text-[10px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center font-bold shadow">

                {jumlahPesanan}

              </span>

            )}

          </Link>

          {/* ================= CART ================= */}
          <Link
            href="/cart"
            className="relative text-2xl hover:scale-110 transition"
          >

            🛒

            {jumlahKeranjang > 0 && (

              <span className="absolute -top-2 -right-3 bg-white text-[#BA88AE] text-[10px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center font-bold shadow">

                {jumlahKeranjang}

              </span>

            )}

          </Link>

          {/* ================= LOGIN ================= */}
          {!user ? (

            <Link
              href="/login"
              className="bg-white text-[#BA88AE] px-4 py-2 rounded-xl hover:bg-pink-50 transition font-medium shadow-sm"
            >
              Masuk
            </Link>

          ) : (

            <div className="relative">

              {/* AVATAR */}
              <div
                onClick={() =>
                  setOpen(!open)
                }
                className="w-10 h-10 cursor-pointer rounded-full bg-white text-[#BA88AE] flex items-center justify-center font-bold shadow"
              >

                {user.username
                  ?.charAt(0)
                  .toUpperCase()}

              </div>

              {/* DROPDOWN */}
              {open && (

                <div className="absolute right-0 mt-3 bg-white rounded-2xl shadow-xl w-40 overflow-hidden border border-pink-100">

                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-3 hover:bg-pink-50 transition text-[#7B4364] font-medium"
                  >
                    Keluar
                  </button>

                </div>

              )}

            </div>

          )}

        </div>

      </div>

    </nav>
  );
}