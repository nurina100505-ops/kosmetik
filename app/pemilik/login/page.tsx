"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPemilik() {

  const router = useRouter();

  // ================= STATE =================
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  // ================= LOGIN =================
  const handleLogin = async (
    e: any
  ) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res = await fetch(
        "/api/pemilik",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await res.json();

      if (data.success) {

        alert(
          "Login berhasil 🎉"
        );

        router.push(
          "/pemilik/dashboard"
        );

      } else {

        alert(
          data.message
        );

      }

    } catch (error) {

      alert(
        "Terjadi kesalahan server"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-[#FFF8FC] flex items-center justify-center px-6 py-10">

      {/* ================= CARD ================= */}
      <div className="relative w-full max-w-md bg-white border border-[#F3CCDE] rounded-[35px] shadow-2xl overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-r from-[#F8D8E8] to-[#FCEEF5] px-8 py-10 text-center">

          {/* BACK */}
          <Link
            href="/"
            className="absolute top-5 right-5 text-[#BA88AE] hover:text-[#A96D98] text-2xl"
          >
            ✕
          </Link>

          {/* TITLE */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#BA88AE] whitespace-nowrap tracking-wide">

            ADMIN LOGIN

          </h1>

          {/* LINE */}
          <div className="w-24 h-1 bg-[#DDA9C5] mx-auto mt-4 rounded-full"></div>

          {/* DESC */}
          <p className="text-[#7B4364] mt-4 text-sm md:text-base">

            Masuk ke dashboard admin MERY HOUSE GALERY ✨

          </p>

        </div>

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleLogin}
          className="px-8 py-8 space-y-6"
        >

          {/* ================= EMAIL ================= */}
          <div>

            <label className="text-[#7B4364] font-semibold text-sm">

              Email Admin

            </label>

            <input
              type="email"
              placeholder="admin@gmail.com"
              required
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full mt-2 border border-[#F3CCDE] rounded-2xl px-4 py-3 bg-[#FFF8FC] text-[#7B4364] focus:outline-none focus:ring-2 focus:ring-[#DDA9C5]"
            />

          </div>

          {/* ================= PASSWORD ================= */}
          <div>

            <label className="text-[#7B4364] font-semibold text-sm">

              Password

            </label>

            <div className="relative mt-2">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full border border-[#F3CCDE] rounded-2xl px-4 py-3 pr-14 bg-[#FFF8FC] text-[#7B4364] focus:outline-none focus:ring-2 focus:ring-[#DDA9C5]"
              />

              {/* SHOW PASSWORD */}
              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-3 text-[#BA88AE] hover:text-[#A96D98] font-medium"
              >

                {showPassword
                  ? "Hide"
                  : "Show"}

              </button>

            </div>

          </div>

          {/* ================= BUTTON ================= */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#BA88AE] hover:bg-[#A96D98] text-white py-3 rounded-2xl font-semibold text-lg transition shadow-md"
          >

            {loading
              ? "Loading..."
              : "Masuk Dashboard"}

          </button>

        </form>

      </div>

    </div>
  );
}