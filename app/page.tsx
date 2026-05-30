"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);

  // ================= MEREK =================
  const brands = [
    {
      name: "Wardah",
      image: "/brands/11.png",
    },

    {
      name: "Vaseline",
      image: "/brands/vaseline.png",
    },

    {
      name: "Maybelline",
      image: "/brands/maybelline.png",
    },

    {
      name: "Garnier",
      image: "/brands/garnier.png",
    },

    {
      name: "Emina",
      image: "/brands/2.png",
    },
  ];

  // ================= KATEGORI =================
  const categories = [
    {
      name: "Skincare",
      image: "/categories/5.png",
    },

    {
      name: "Makeup",
      image: "/categories/6.png",
    },

    {
      name: "Bodycare",
      image: "/categories/3.png",
    },

    {
      name: "Haircare",
      image: "/categories/4.png",
    },
  ];

  // ================= AMBIL PRODUK =================
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");

      const data = await res.json();

      // hanya produk rekomendasi
      const recommendedProducts = data.filter(
        (item: any) => item.is_recommended === true
      );

      setProducts(recommendedProducts);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="bg-[#D6A8C4] text-white">

        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">

          <div>

            <p className="uppercase tracking-[4px] text-sm text-white/80 mb-3">
              Mery House Galery
            </p>

            <h1 className="text-4xl md:text-5xl font-bold leading-snug">

              Kosmetik Berkualitas <br />
              untuk Tampil Lebih Percaya Diri

            </h1>

            <p className="mt-5 text-white/90 leading-7 max-w-lg">

              Temukan produk kecantikan terbaik sesuai kebutuhanmu
              mulai dari skincare, makeup, bodycare hingga haircare
              dari brand terpercaya.

            </p>

            <Link
              href="/products"
              className="inline-block mt-7 bg-white text-[#B76E9B] px-7 py-3 rounded-full font-semibold hover:bg-[#F3CCDE] transition"
            >
              Belanja Sekarang
            </Link>

          </div>

          <div className="relative h-[340px] w-full">

            <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl"></div>

            <Image
              src="/scinkare1.png"
              alt="hero"
              fill
              className="object-contain relative z-10"
            />

          </div>

        </div>

      </section>

      {/* ================= BELANJA BERDASARKAN MEREK ================= */}
      <section className="max-w-7xl mx-auto px-6 py-14 overflow-hidden">

        <div className="flex flex-col items-center justify-center mb-7 text-center">

          <h2 className="text-3xl font-bold text-[#B76E9B]">
            Belanja Berdasarkan Merek
          </h2>

          <div className="w-20 h-1 bg-[#F3CCDE] rounded-full mt-3"></div>

        </div>

        {/* SCROLL HORIZONTAL */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">

          {brands.map((brand) => (

            <Link
              key={brand.name}
              href={`/products/brand/${brand.name}`}
              className="min-w-[220px] bg-[#FFF6FA] border border-[#F3CCDE] p-6 rounded-3xl hover:-translate-y-1 hover:shadow-xl transition text-center flex-shrink-0"
            >

              {/* IMAGE */}
              <div className="w-28 h-28 mx-auto mb-5 bg-[#F3CCDE] rounded-full flex items-center justify-center shadow-md">

                <div className="relative w-16 h-16">

                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-contain"
                  />

                </div>

              </div>

              {/* NAME */}
              <p className="font-semibold text-lg text-[#9C5A83]">
                {brand.name}
              </p>

            </Link>

          ))}

        </div>

      </section>

      {/* ================= KATEGORI UNGGULAN ================= */}
      <section className="max-w-7xl mx-auto px-6 py-14">

        <div className="flex flex-col items-center justify-center mb-7 text-center">

          <h2 className="text-3xl font-bold text-[#B76E9B]">
            Kategori Unggulan
          </h2>

          <div className="w-20 h-1 bg-[#F3CCDE] rounded-full mt-3"></div>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {categories.map((cat) => (

            <Link
              key={cat.name}
              href={`/products/category/${cat.name}`}
              className="bg-[#FFF6FA] border border-[#F3CCDE] p-7 rounded-3xl hover:-translate-y-1 hover:shadow-xl text-center transition"
            >

              <div className="w-24 h-24 mx-auto mb-5 bg-[#F3CCDE] rounded-full flex items-center justify-center shadow-md">

                <div className="relative h-14 w-14">

                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-contain"
                  />

                </div>

              </div>

              <p className="font-semibold text-[#9C5A83] text-lg">
                {cat.name}
              </p>

            </Link>

          ))}

        </div>

      </section>

      {/* ================= PRODUK REKOMENDASI ================= */}
      <section className="max-w-7xl mx-auto px-6 py-14">

        <div className="flex flex-col items-center justify-center mb-7 text-center">

          <h2 className="text-3xl font-bold text-[#B76E9B]">
            Produk Rekomendasi Untuk Kamu
          </h2>

          <div className="w-20 h-1 bg-[#F3CCDE] rounded-full mt-3"></div>

        </div>

        {products.length === 0 ? (

          <div className="bg-[#FFF6FA] border border-[#F3CCDE] rounded-3xl p-10 text-center shadow">

            <p className="text-gray-500">
              Belum ada produk rekomendasi
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {products.map((product) => (

              <div
                key={product.id}
                className="bg-[#FFF6FA] border border-[#F3CCDE] p-5 rounded-3xl hover:shadow-2xl hover:-translate-y-1 transition flex flex-col h-full"
              >

                <div className="bg-[#F3CCDE] rounded-2xl p-4 mb-4">

                  <div className="relative h-40">

                    <Image
                      src={product.image || "/produk4.png"}
                      alt={product.name || "produk"}
                      fill
                      className="object-contain rounded-lg"
                    />

                  </div>

                </div>

                <h3 className="text-sm font-semibold text-[#7B4364]">
                  {product.name}
                </h3>

                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-6">
                  {product.description}
                </p>

                <p className="text-[#B76E9B] font-bold mt-3 text-lg">

                  Rp{" "}
                  {Number(product.price).toLocaleString("id-ID")}

                </p>

                <div className="flex gap-2 mt-auto pt-5">

                  <button
                    onClick={async () => {

                      const user = JSON.parse(
                        localStorage.getItem("user") || "{}"
                      )

                      if (!user.id) {
                        alert("Silakan login terlebih dahulu")
                        router.push("/login")
                        return
                      }

                      await fetch("/api/cart", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },

                        body: JSON.stringify({
                          user_id: user.id,
                          product_id: product.id,
                          quantity: 1,
                        }),
                      })

                      alert("Produk masuk ke keranjang 🛒")

                    }}
                    className="flex-1 bg-[#F3CCDE] hover:bg-[#EAB8CD] text-[#7B4364] py-2.5 rounded-xl text-sm font-semibold transition"
                  >
                    🛒 Keranjang
                  </button>

                  <button
                    onClick={() => {

                      const user = JSON.parse(
                        localStorage.getItem("user") || "{}"
                      )

                      if (!user.id) {
                        alert("Silakan login terlebih dahulu")
                        router.push("/login")
                        return
                      }

                      localStorage.setItem(
                        "checkoutItems",
                        JSON.stringify([
                          {
                            id: product.id,
                            name: product.name,
                            image: product.image,
                            price: product.price,
                            quantity: 1,
                          },
                        ])
                      )

                      router.push("/checkout")

                    }}
                    className="flex-1 bg-[#D6A8C4] hover:bg-[#C98AB2] text-white py-2.5 rounded-xl text-sm font-semibold transition"
                  >
                    ✅ Checkout
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* ================= TENTANG TOKO ================= */}
      <section
        id="about"
        className="mt-20 bg-gradient-to-br from-[#FDF2F8] via-[#FCE7F3] to-[#F3CCDE]"
      >

        <div className="max-w-5xl mx-auto px-6 py-20 text-center">

          <div className="inline-block bg-white px-5 py-2 rounded-full shadow mb-5">

            <p className="text-[#B76E9B] font-semibold text-sm tracking-wide">
              TENTANG TOKO KAMI
            </p>

          </div>

          <h2 className="text-4xl font-bold text-[#9C5A83] mb-5">
            Mery House Galery
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto leading-8 text-lg">

            Menyediakan berbagai produk kecantikan original dan
            berkualitas mulai dari skincare, makeup, bodycare,
            hingga haircare dari brand terpercaya untuk menunjang
            penampilan dan rasa percaya diri kamu setiap hari.

          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-12 text-left">

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-[#F3CCDE]">

              <p className="text-[#B76E9B] font-bold text-lg mb-4">
                📍 Informasi Toko
              </p>

              <div className="space-y-4 text-gray-700 leading-7">

                <p>
                  📍 Jalan lintang, Aceh Tengah
                </p>

                <p>
                  📞 083857093320
                </p>

                <p>
                  📧 meryhousegalery@gmail.com
                </p>

                <p>
                  🕒 08:00 - 22:00 WIB
                </p>

              </div>

            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-[#F3CCDE]">

              <p className="text-[#B76E9B] font-bold text-lg mb-4">
                💕 Kenapa Belanja di Sini?
              </p>

              <div className="space-y-4 text-gray-700 leading-7">

                <p>
                  ✨ Produk original dan berkualitas
                </p>

                <p>
                  ✨ Harga terjangkau
                </p>

                <p>
                  ✨ Banyak pilihan merek terkenal
                </p>

                <p>
                  ✨ Pelayanan ramah dan cepat
                </p>

                <p>
                  ✨ Produk kecantikan selalu update
                </p>

              </div>

            </div>

          </div>

          <div className="mt-10">

            <p className="text-[#9C5A83] font-medium">
              📱 Instagram: @meryhousegalery
            </p>

          </div>

        </div>

      </section>
    </>
  );
}