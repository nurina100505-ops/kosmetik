"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function ProductsPage() {

  const searchParams = useSearchParams();
  const router = useRouter();

  // 🔥 AMBIL SEARCH
  const search = searchParams.get("search") || "";

  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] =
    useState<any[]>([]);

  // ================= FETCH PRODUK =================
  const fetchProducts = async () => {

    try {

      const res = await fetch("/api/products");

      const data = await res.json();

      setProducts(data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= FILTER SEARCH =================
  useEffect(() => {

    if (!search) {
      setFilteredProducts(products);
      return;
    }

    const result = products.filter((item: any) =>
      item.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredProducts(result);

  }, [search, products]);

  // ================= TAMBAH KERANJANG =================
  const addToCart = async (product: any) => {

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (!user?.id) {
      alert("Silakan login dulu!");
      return;
    }

    try {

      const res = await fetch("/api/cart", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (res.ok) {

  // 🔥 UPDATE NAVBAR
  window.dispatchEvent(
    new Event("cartUpdated")
  );

  alert("Produk berhasil masuk keranjang 🛒");

} else {

  alert(data.message || "Gagal tambah keranjang");

}

    } catch (error) {
      console.log(error);
    }
  };

  // ================= CHECKOUT =================
  const handleCheckout = (product: any) => {

    const checkoutItem = [
      {
        ...product,
        quantity: 1,
      },
    ];

    localStorage.setItem(
      "checkoutItems",
      JSON.stringify(checkoutItem)
    );

    router.push("/checkout");
  };

  return (

    <div className="min-h-screen bg-[#FFF8FC] px-4 md:px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* ================= TITLE ================= */}
        <div className="mb-10 text-center">

          <h1 className="text-3xl md:text-5xl font-bold text-[#BA88AE]">
            Produk Kecantikan
          </h1>

          <div className="w-28 h-1 bg-[#E7BDD1] mx-auto mt-4 rounded-full"></div>

          {search && (

            <p className="text-[#7B4364] mt-4 text-base md:text-lg">

              Hasil pencarian untuk:

              <span className="font-bold text-[#BA88AE]">
                {" "} "{search}"
              </span>

            </p>

          )}

        </div>

        {/* ================= EMPTY ================= */}
        {filteredProducts.length === 0 ? (

          <div className="bg-white rounded-[30px] p-10 text-center border border-[#F3CCDE] shadow-sm">

            <h2 className="text-2xl md:text-3xl font-bold text-[#BA88AE]">
              Produk Tidak Ditemukan
            </h2>

            <p className="text-[#7B4364] mt-3">
              Coba gunakan kata kunci lain 💖
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">

            {filteredProducts.map((item: any) => (

              <div
                key={item.id}
                className="bg-white rounded-[24px] border border-[#F3CCDE] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >

                {/* ================= IMAGE ================= */}
                <div className="relative w-full h-44 md:h-52 bg-[#FFF8FC]">

                  <Image
                    src={
                      item.image &&
                      item.image.trim() !== ""
                        ? item.image
                        : "/produk4.png"
                    }
                    alt={item.name}
                    fill
                    className="object-cover"
                  />

                </div>

                {/* ================= CONTENT ================= */}
                <div className="p-4">

                  <h2 className="font-semibold text-[#7B4364] text-sm md:text-base line-clamp-2 min-h-[44px]">
                    {item.name}
                  </h2>

                  <p className="text-[#BA88AE] font-bold mt-2 text-lg md:text-xl">
                    Rp{" "}
                    {new Intl.NumberFormat(
                      "id-ID"
                    ).format(item.price)}
                  </p>

                  {/* ================= BUTTON ================= */}
                  <div className="flex gap-2 mt-4">

                    {/* KERANJANG */}
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 bg-[#F6D8E7] hover:bg-[#EDC3D8] text-[#7B4364] py-2 rounded-xl font-semibold text-xs md:text-sm transition"
                    >
                      🛒 Keranjang
                    </button>

                    {/* CHECKOUT */}
                    <button
                      onClick={() =>
                        handleCheckout(item)
                      }
                      className="flex-1 bg-[#BA88AE] hover:bg-[#A96D98] text-white py-2 rounded-xl font-semibold text-xs md:text-sm transition shadow-sm"
                    >
                      Checkout
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}