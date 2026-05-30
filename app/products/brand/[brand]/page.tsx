"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function BrandPage() {

  const params = useParams()
  const router = useRouter()

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // ================= BRAND IMAGE =================
  const brandImages: any = {
    Wardah: "/brands/1.png",
    Vaseline: "/brands/vaseline.png",
    Maybelline: "/brands/maybelline.png",
    Garnier: "/brands/garnier.png",
    Emina: "/brands/emina.png",
  }

  useEffect(() => {

    if (!params.brand) return

    setLoading(true)

    fetch(`/api/products?brand=${params.brand}`)
      .then((res) => res.json())
      .then((data) => {

        if (Array.isArray(data)) {
          setProducts(data)
        } else {
          setProducts([])
        }

        setLoading(false)

      })
      .catch(() => {

        setProducts([])
        setLoading(false)

      })

  }, [params.brand])

  // ================= CHECK LOGIN =================
  const checkLogin = () => {

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    )

    if (!user.id) {
      alert("Silakan login terlebih dahulu")
      router.push("/login")
      return null
    }

    return user
  }

  return (
    <main className="min-h-screen bg-[#FFF8FC]">

      {/* ================= HERO ================= */}
      <section className="bg-[#D6A8C4] px-6 py-12">

        <div className="max-w-4xl mx-auto">

          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl px-6 py-8 flex flex-col items-center justify-center text-center shadow-lg">

            {/* BRAND IMAGE */}
            <div className="relative w-20 h-20 bg-white rounded-full shadow-md mb-4 overflow-hidden">

              <Image
                src={
                  brandImages[
                    decodeURIComponent(
                      params.brand as string
                    )
                  ] || "/no-image.png"
                }
                alt={params.brand as string}
                fill
                className="object-contain p-3"
              />

            </div>

            {/* BRAND NAME */}
            <h1 className="text-3xl md:text-4xl font-bold capitalize text-white">

              {decodeURIComponent(
                params.brand as string
              )}

            </h1>

            <p className="text-white/90 mt-3 text-sm md:text-base">
              Temukan produk terbaik dari merek favoritmu
            </p>

          </div>

        </div>

      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-7xl mx-auto px-6 py-14">

        {loading && (
          <p className="text-center text-[#9C5A83] font-medium">
            Memuat produk...
          </p>
        )}

        {!loading && products.length === 0 && (
          <div className="bg-white border border-[#F3CCDE] rounded-3xl p-10 text-center shadow">

            <p className="text-gray-500">
              Tidak ada produk dari merek ini
            </p>

          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {products.map((item: any) => (

            <div
              key={item.id}
              className="bg-[#FFF6FA] border border-[#F3CCDE] p-5 rounded-3xl hover:shadow-2xl hover:-translate-y-1 transition flex flex-col h-full"
            >

              {/* IMAGE */}
              <div className="bg-[#F3CCDE] rounded-2xl p-4 mb-4">

                <div className="relative w-full h-40">

                  <Image
                    src={item.image || "/no-image.png"}
                    alt={item.name}
                    fill
                    className="object-contain rounded-xl"
                  />

                </div>

              </div>

              {/* NAME */}
              <h3 className="font-semibold text-sm text-[#7B4364] line-clamp-2">
                {item.name}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-6">
                {item.description}
              </p>

              {/* PRICE */}
              <p className="text-[#B76E9B] font-bold mt-3 text-lg">
                Rp {Number(item.price).toLocaleString("id-ID")}
              </p>

              {/* STOCK */}
              <p className="text-xs text-gray-400 mt-1">
                Stok: {item.stock}
              </p>

              {/* BUTTON */}
              <div className="grid grid-cols-2 gap-2 mt-5">

                {/* KERANJANG */}
                <button
                  onClick={async () => {

                    const user = checkLogin()

                    if (!user) return

                    await fetch("/api/cart", {
                      method: "POST",

                      headers: {
                        "Content-Type": "application/json",
                      },

                      body: JSON.stringify({
                        user_id: user.id,
                        product_id: item.id,
                        quantity: 1,
                      }),
                    })

                    alert("Produk masuk ke keranjang 🛒")

                  }}
                  className="bg-[#F3CCDE] hover:bg-[#EAB8CD] text-[#7B4364] py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  🛒 Keranjang
                </button>

                {/* CHECKOUT */}
                <button
                  onClick={() => {

                    const user = checkLogin()

                    if (!user) return

                    localStorage.setItem(
                      "checkoutItems",
                      JSON.stringify([
                        {
                          id: item.id,
                          name: item.name,
                          image: item.image,
                          price: item.price,
                          quantity: 1,
                        },
                      ])
                    )

                    router.push("/checkout")

                  }}
                  className="bg-[#D6A8C4] hover:bg-[#C98AB2] text-white py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  ✅ Checkout
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  )
}