'use client';

import { useEffect, useState } from "react";

export default function PesananPage() {
  const [orders, setOrders] = useState<any[]>([]);

  // ================= AMBIL PESANAN =================
  const fetchOrders = async () => {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (!user?.id) {
      alert("Silakan login dulu");
      return;
    }

    try {

      const res = await fetch(
        `/api/pesanan?user_id=${user.id}`
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }

    } catch (error) {
      console.error(error);
    }
  };

  // ================= LOAD =================
  useEffect(() => {

    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  // ================= FORMAT RUPIAH =================
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number || 0);
  };

  // ================= FORMAT DATE =================
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ================= STATUS STEP =================
  const getStatusStep = (status: string) => {

    switch (status) {

      case "pending":
        return 0;

      case "shipped":
        return 1;

      case "completed":
        return 2;

      default:
        return 0;
    }
  };

  // ================= STATUS TEXT =================
  const getStatusText = (status: string) => {

    switch (status) {

      case "pending":
        return "Diproses";

      case "shipped":
        return "Dikirim";

      case "completed":
        return "Selesai";

      default:
        return "Diproses";
    }
  };

  return (

    <div className="min-h-screen bg-[#FFF8FC] px-4 md:px-8 py-10">

      {/* ================= WRAPPER ================= */}
      <div className="max-w-5xl mx-auto">

        {/* ================= TITLE ================= */}
        <div className="text-center mb-10">

          <h1 className="text-4xl md:text-5xl font-bold text-[#B76E9B]">
            Pesanan Saya
          </h1>

          <div className="w-28 h-1 bg-[#F3CCDE] mx-auto mt-4 rounded-full"></div>

          <p className="text-[#7B4364] mt-3 text-sm md:text-base">
            Pantau status pesanan skincare & makeup kamu ✨
          </p>

        </div>

        {/* ================= KOSONG ================= */}
        {orders.length === 0 && (

          <div className="bg-white border border-[#F3CCDE] rounded-3xl p-10 shadow-sm text-center">

            <h2 className="text-xl font-semibold text-[#B76E9B] mb-2">
              Belum Ada Pesanan
            </h2>

            <p className="text-[#7B4364]">
              Yuk checkout produk favorit kamu sekarang 💖
            </p>

          </div>

        )}

        {/* ================= LIST ORDER ================= */}
        <div className="space-y-8">

          {orders.map((order) => (

            <div
              key={order.id}
              className="bg-white border border-[#F3CCDE] rounded-[30px] shadow-sm overflow-hidden"
            >

              {/* ================= TOP ================= */}
              <div className="bg-gradient-to-r from-[#FFF0F6] to-[#FFF8FC] p-6 border-b border-[#F3CCDE]">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  {/* LEFT */}
                  <div>

                    <p className="text-sm text-[#7B4364] mb-1">
                      Invoice Pesanan
                    </p>

                    <h2 className="text-2xl font-bold text-[#B76E9B]">
                      INV-{order.id}
                    </h2>

                    <p className="text-sm text-[#7B4364] mt-1">
                      {formatDate(order.created_at)}
                    </p>

                  </div>

                  {/* RIGHT */}
                  <div className="text-left md:text-right">

                    <p className="text-sm text-[#7B4364]">
                      Status Pesanan
                    </p>

                    <span className="inline-block mt-3 bg-[#F3CCDE] text-[#7B4364] text-sm px-4 py-2 rounded-full font-medium">
                      {getStatusText(order.status)}
                    </span>

                  </div>

                </div>

              </div>

              {/* ================= PROGRESS ================= */}
              <div className="px-6 pt-8">

                <div className="relative flex justify-between items-center">

                  {/* GARIS */}
                  <div className="absolute top-3 left-0 w-full h-[4px] bg-[#F3CCDE] rounded-full"></div>

                  {/* GARIS ACTIVE */}
                  <div
                    className={`absolute top-3 left-0 h-[4px] bg-[#D78FB3] rounded-full transition-all duration-500 ${
                      getStatusStep(order.status) === 0
                        ? "w-0"
                        : getStatusStep(order.status) === 1
                        ? "w-1/2"
                        : "w-full"
                    }`}
                  ></div>

                  {/* STEP */}
                  {["Diproses", "Dikirim", "Selesai"].map(
                    (step, i) => (

                      <div
                        key={i}
                        className="relative z-10 flex flex-col items-center flex-1"
                      >

                        <div
                          className={`w-7 h-7 rounded-full border-4 transition-all duration-300 ${
                            i <= getStatusStep(order.status)
                              ? "bg-[#B76E9B] border-[#F8D8E8]"
                              : "bg-white border-[#F3CCDE]"
                          }`}
                        ></div>

                        <p
                          className={`mt-3 text-sm font-medium ${
                            i <= getStatusStep(order.status)
                              ? "text-[#B76E9B]"
                              : "text-gray-400"
                          }`}
                        >
                          {step}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* ================= PRODUK ================= */}
              <div className="p-6 space-y-5">

                {order.order_items?.map((item: any) => (

                  <div
                    key={item.id}
                    className="flex items-center justify-between border border-[#F8D8E8] rounded-2xl p-4 hover:bg-[#FFF8FC] transition"
                  >

                    {/* LEFT */}
                    <div className="flex items-center gap-4">

                      <img
                        src={
                          item.products?.image &&
                          item.products?.image.trim() !== ""
                            ? item.products.image
                            : "/no-image.png"
                        }
                        alt="produk"
                        className="w-20 h-20 rounded-2xl object-cover border border-[#F3CCDE] bg-white"
                        onError={(e) => {
                          (
                            e.target as HTMLImageElement
                          ).src = "/no-image.png";
                        }}
                      />

                      <div>

                        <h3 className="font-semibold text-[#7B4364] text-lg">
                          {item.products?.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Qty {item.quantity} ×{" "}
                          {formatRupiah(item.price)}
                        </p>

                      </div>

                    </div>

                    {/* RIGHT */}
                    <div className="text-right">

                      <p className="text-sm text-gray-400">
                        Subtotal
                      </p>

                      <h3 className="font-bold text-[#B76E9B] text-lg mt-1">
                        {formatRupiah(
                          item.quantity * item.price
                        )}
                      </h3>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}