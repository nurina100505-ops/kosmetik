"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID").format(num);

export default function CheckoutPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);

  const [shippingMethod, setShippingMethod] =
    useState("delivery");

  const [shippingCost, setShippingCost] =
    useState(15000);

  const [cities, setCities] = useState<any[]>([]);
  const [cityId, setCityId] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [paymentProof, setPaymentProof] =
    useState("");

  const [user, setUser] = useState<any>(null);

  const rekening = "7285876588";

  const copyRekening = () => {
    navigator.clipboard.writeText(rekening);
    alert("Nomor rekening berhasil disalin!");
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));

    const checkoutData = JSON.parse(
      localStorage.getItem("checkoutItems") || "[]"
    );

    const cartData = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const finalData =
      checkoutData.length > 0 ? checkoutData : cartData;

    // ✅ FIX IMAGE + QTY + ANTI EMPTY IMAGE
    const safeData = finalData.map((item: any) => ({
      ...item,
      image:
        item.image && item.image.trim() !== ""
          ? item.image
          : "/no-image.png",
      quantity: item.quantity || item.qty || 1,
    }));

    setCartItems(safeData);

    const totalHarga = safeData.reduce(
      (acc: number, item: any) =>
        acc +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );

    setSubtotal(totalHarga);
  }, []);

  // ================= CITIES =================
  useEffect(() => {
    const getCities = async () => {
      try {
        const res = await fetch(
          "/api/shipping?type=kota&provinsi_id=11"
        );

        const data = await res.json();

        if (Array.isArray(data)) setCities(data);
        else if (Array.isArray(data.value)) setCities(data.value);
        else setCities([]);
      } catch {
        setCities([]);
      }
    };

    getCities();
  }, []);

  // ================= ONGKIR =================
  const getOngkir = async (destination: string) => {
    try {
      const res = await fetch(
        `/api/shipping?type=ongkir&origin=1101&destination=${destination}&weight=1000`
      );

      const data = await res.json();

      if (data?.length > 0 && data[0]?.costs?.length > 0) {
        setShippingCost(data[0].costs[0].cost[0].value);
      } else {
        setShippingCost(0);
      }
    } catch {
      setShippingCost(0);
    }
  };

  const handleDelivery = () => {
    setShippingMethod("delivery");
    setShippingCost(15000);
  };

  const handleJNT = async () => {
    if (!cityId) return alert("Pilih kota dulu!");
    setShippingMethod("jnt");
    await getOngkir(cityId);
  };

  const total = subtotal + shippingCost;

  // ================= CHECKOUT =================
  const handleCheckout = async () => {
    if (!user) return alert("Silakan login dulu!");
    if (!name || !phone || !address) return alert("Lengkapi data!");
    if (cartItems.length === 0) return alert("Produk kosong!");
    if (!paymentProof) return alert("Upload bukti pembayaran!");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        receiver_name: name,
        phone,
        address,
        shipping_method: shippingMethod,
        shipping_cost: shippingCost,
        total_price: total,
        payment_proof: paymentProof,
        cartItems,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Pesanan berhasil!");
      localStorage.removeItem("checkoutItems");
      localStorage.removeItem("cart");
      router.push("/pesanan?success=true");
    } else {
      alert(data.message || "Gagal checkout");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5FB] px-6 py-10">

      {/* TITLE */}
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-[#B76E9B]">
          Checkout Pesanan
        </h1>
        <div className="w-28 h-1 bg-[#F3CCDE] mx-auto mt-3 rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">

          {/* USER */}
          <div className="bg-white border border-[#F3CCDE] p-6 rounded-3xl shadow-sm">
            <h2 className="font-semibold text-[#B76E9B] mb-4">
              Informasi Penerima
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input className="input" placeholder="Nama lengkap" value={name} onChange={(e) => setName(e.target.value)} />
              <input className="input" placeholder="No WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-white border border-[#F3CCDE] p-6 rounded-3xl shadow-sm">
            <textarea className="input h-24" placeholder="Alamat lengkap" value={address} onChange={(e) => setAddress(e.target.value)} />

            <select className="input mt-3" value={cityId} onChange={(e) => {
              setCityId(e.target.value);
              if (shippingMethod === "jnt") getOngkir(e.target.value);
            }}>
              <option value="">Pilih Kota</option>
              {cities.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* SHIPPING */}
          <div className="bg-white border border-[#F3CCDE] p-6 rounded-3xl shadow-sm">
            <div className="flex gap-4">
              <button onClick={handleDelivery} className="btn">Delivery</button>
              <button onClick={handleJNT} className="btn">JNT</button>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white border border-[#F3CCDE] p-6 rounded-3xl shadow-sm">

            <label className="block border-2 border-dashed border-[#F3CCDE] p-6 rounded-xl text-center cursor-pointer bg-[#FFF6FA]">
              {paymentProof ? "Bukti terupload" : "Upload bukti pembayaran"}
              <input type="file" hidden onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onloadend = () => setPaymentProof(reader.result as string);
                reader.readAsDataURL(file);
              }} />
            </label>

            <div className="mt-4 bg-[#F3CCDE] p-4 rounded-xl text-[#7B4364]">
              <p className="font-bold">BSI - Bank Syariah Indonesia</p>
              <p className="text-lg">{rekening}</p>
              <button onClick={copyRekening} className="mt-2 bg-[#B76E9B] text-white px-3 py-1 rounded-lg">
                Salin
              </button>
            </div>

          </div>

          <button onClick={handleCheckout} className="w-full bg-[#B76E9B] hover:bg-[#9d5f84] text-white py-3 rounded-2xl">
            Checkout
          </button>

        </div>

        {/* RIGHT */}
        <div className="bg-white p-5 rounded-3xl border border-[#F3CCDE]">

          {cartItems.map((item: any, i: number) => (
            <div key={i} className="flex justify-between mb-4">

              {/* ✅ FIX IMAGE ANTI KEDIP */}
              <img
                src={item.image}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/no-image.png";
                }}
                className="w-14 h-14 rounded-xl object-cover border border-[#F3CCDE]"
              />

              <div className="flex-1 ml-2">
                <p className="text-[#7B4364] font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>

              <p className="text-[#B76E9B] font-semibold">
                Rp{formatRupiah(item.price * item.quantity)}
              </p>
            </div>
          ))}

          <hr className="my-3 border-[#F3CCDE]" />

          <p>Subtotal: Rp{formatRupiah(subtotal)}</p>
          <p>Ongkir: Rp{formatRupiah(shippingCost)}</p>

          <p className="font-bold text-[#B76E9B] mt-2">
            Total: Rp{formatRupiah(total)}
          </p>

        </div>

      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #F3CCDE;
          outline: none;
        }

        .btn {
          flex: 1;
          padding: 10px;
          border-radius: 12px;
          border: 1px solid #F3CCDE;
          color: #7B4364;
        }
      `}</style>

    </div>
  );
}