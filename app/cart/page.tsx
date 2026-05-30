"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: number;
  product_id: number;
  brand: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  qty: number;
  selected: boolean;
};

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID").format(num);

export default function CartPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= GET CART =================
  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (!user.id) {
      alert("Harus login terlebih dahulu");
      router.push("/login");
      return;
    }

    fetch(`/api/cart?user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => {

        if (data && data.cart_items) {

          const mapped = data.cart_items.map((item: any) => ({

            id: item.id,

            product_id: item.product_id,

            brand: item.products?.brands?.name || "-",

            name: item.products?.name || "Produk",

            // 🔥 FIX GAMBAR KOSONG
            image:
              item.products?.image &&
              item.products.image.trim() !== ""
                ? item.products.image
                : "/no-image.png",

            price: item.products?.price || 0,

            originalPrice: item.products?.price || 0,

            qty: item.quantity,

            selected: false,

          }));

          setCartItems(mapped);

        } else {

          setCartItems([]);

        }

        setLoading(false);

      })
      .catch(() => {

        setCartItems([]);
        setLoading(false);

      });

  }, []);

  // ================= SELECT ITEM =================
  const toggleSelect = (id: number) => {

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, selected: !item.selected }
          : item
      )
    );

  };

  // ================= UPDATE QTY =================
  const updateQty = async (
    id: number,
    type: "inc" | "dec"
  ) => {

    const item = cartItems.find((i) => i.id === id);

    if (!item) return;

    let newQty = item.qty;

    if (type === "inc") newQty++;

    if (type === "dec" && item.qty > 1) newQty--;

    await fetch("/api/cart", {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        item_id: id,
        quantity: newQty,
      }),
    });

    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, qty: newQty }
          : i
      )
    );

  };

  // ================= DELETE ITEM =================
  const deleteItem = async (id: number) => {

    await fetch("/api/cart", {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        item_id: id,
      }),
    });

    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );

  };

  const selectedItems = cartItems.filter(
    (item) => item.selected
  );

  // ================= CHECKOUT =================
  const handleCheckout = () => {

    if (selectedItems.length === 0) {
      alert("Pilih produk terlebih dahulu 🤍");
      return;
    }

    const formattedItems = selectedItems.map((item) => ({
      cart_item_id: item.id,
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.qty,
    }));

    localStorage.setItem(
      "checkoutItems",
      JSON.stringify(formattedItems)
    );

    router.push("/checkout");

  };

  // ================= TOTAL =================
  const totalSelected = selectedItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <div className="min-h-screen bg-[#FFF8FC] px-6 py-10">

      {/* ================= TITLE ================= */}
      <div className="max-w-7xl mx-auto mb-8 text-center">

        <h1 className="text-4xl font-bold text-[#B76E9B]">
          Keranjang Belanja
        </h1>

        <div className="w-24 h-1 bg-[#F3CCDE] rounded-full mx-auto mt-3"></div>

      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <p className="text-center text-[#9C5A83]">
          Memuat keranjang...
        </p>
      )}

      {/* ================= EMPTY ================= */}
      {!loading && cartItems.length === 0 && (

        <div className="max-w-3xl mx-auto bg-white border border-[#F3CCDE] rounded-3xl p-10 text-center shadow">

          <p className="text-gray-500 text-lg">
            Keranjang belanja masih kosong 🤍
          </p>

        </div>

      )}

      {/* ================= CONTENT ================= */}
      {!loading && cartItems.length > 0 && (

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ================= LEFT ================= */}
          <div className="lg:col-span-2 bg-white border border-[#F3CCDE] p-6 rounded-3xl shadow-sm">

            {cartItems.map((item) => (

              <div
                key={item.id}
                className="flex items-center justify-between border-b border-[#F8DCE8] py-6 gap-4"
              >

                {/* LEFT CONTENT */}
                <div className="flex items-start gap-4 flex-1">

                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelect(item.id)}
                    className="mt-5 w-4 h-4 accent-[#D6A8C4]"
                  />

                  {/* IMAGE */}
                  <div className="relative w-24 h-24 bg-[#FFF6FA] border border-[#F3CCDE] rounded-2xl overflow-hidden flex-shrink-0">

                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-3"
                    />

                  </div>

                  {/* INFO */}
                  <div className="flex-1">

                    <p className="text-sm text-[#B76E9B] font-semibold">
                      {item.brand}
                    </p>

                    <p className="text-sm font-medium text-[#7B4364] mt-1">
                      {item.name}
                    </p>

                    <div className="mt-3">

                        <p className="text-[#B76E9B] font-bold text-lg">
                          Rp{formatRupiah(item.price)}
                        </p>

                      </div>

                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-400 hover:text-red-500 text-xs mt-3"
                    >
                      Hapus Produk
                    </button>

                  </div>

                </div>

                {/* ================= QTY ================= */}
                <div className="flex items-center gap-3 bg-[#FFF6FA] px-3 py-2 rounded-full border border-[#F3CCDE]">

                  <button
                    onClick={() => updateQty(item.id, "dec")}
                    className="w-7 h-7 rounded-full bg-white border border-[#F3CCDE] flex items-center justify-center text-[#B76E9B] hover:bg-[#FDEAF2]"
                  >
                    -
                  </button>

                  <span className="text-[#7B4364] font-medium">
                    {item.qty}
                  </span>

                  <button
                    onClick={() => updateQty(item.id, "inc")}
                    className="w-7 h-7 rounded-full bg-white border border-[#F3CCDE] flex items-center justify-center text-[#B76E9B] hover:bg-[#FDEAF2]"
                  >
                    +
                  </button>

                </div>

              </div>

            ))}

          </div>

          {/* ================= RIGHT ================= */}
          <div className="bg-white border border-[#F3CCDE] p-6 rounded-3xl shadow-sm h-fit">

            <h2 className="text-xl font-bold text-[#B76E9B] mb-5">
              Ringkasan Belanja
            </h2>

            <div className="flex justify-between items-center mb-6">

              <span className="text-[#7B4364]">
                Total Produk Dipilih
              </span>

              <span className="text-[#B76E9B] font-bold text-lg">
                Rp{formatRupiah(totalSelected)}
              </span>

            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-[#D6A8C4] hover:bg-[#C98AB2] text-white py-3 rounded-2xl font-semibold transition"
            >
              Checkout ({selectedItems.length})
            </button>

          </div>

        </div>

      )}

    </div>
  );
}