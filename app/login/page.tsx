"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });

  // ================= HANDLE INPUT =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  // ================= LOGIN =================
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const res = await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username:
              form.username,
            password:
              form.password,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        setError(
          data.error ||
            "Login gagal"
        );

        setLoading(false);
        return;
      }

      // ================= SIMPAN =================
      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // ================= REDIRECT =================
      if (
        data.user.role ===
        "admin"
      ) {

        router.push(
          "/admin/dashboard"
        );

      } else {

        window.location.href =
          "/";
      }

    } catch (err) {

      setError(
        "Terjadi kesalahan server"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-[#FFF8FC] flex items-center justify-center px-4 py-10">

      {/* ================= CARD ================= */}
      <div className="relative w-full max-w-md bg-white border border-[#F3CCDE] rounded-[35px] shadow-xl overflow-hidden">

        {/* ================= TOP ================= */}
        <div className="bg-gradient-to-r from-[#F8D8E8] to-[#FCEEF5] px-8 py-10 text-center">

          {/* CLOSE */}
          <Link
            href="/"
            className="absolute top-5 right-5 text-[#BA88AE] hover:text-[#A96D98] text-xl"
          >
            ✕
          </Link>

          {/* TITLE */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#BA88AE] tracking-wide whitespace-nowrap">

            MERY HOUSE GALERY

          </h1>

          <div className="w-24 h-1 bg-[#DDA9C5] mx-auto mt-4 rounded-full"></div>

          <p className="text-[#7B4364] mt-4 text-sm md:text-base">
            Masuk untuk belanja skincare & makeup favorit kamu ✨
          </p>

        </div>

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="px-8 py-8 space-y-6"
        >

          {/* ================= ERROR ================= */}
          {error && (

            <div className="bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm">

              {error}

            </div>

          )}

          {/* ================= USERNAME ================= */}
          <div>

            <label className="text-[#7B4364] font-semibold text-sm">

              Username

            </label>

            <input
              type="text"
              name="username"
              required
              value={form.username}
              onChange={handleChange}
              placeholder="Masukkan username"
              className="w-full mt-2 border border-[#F3CCDE] rounded-2xl px-4 py-3 text-[#7B4364] focus:outline-none focus:ring-2 focus:ring-[#DDA9C5] bg-[#FFF8FC]"
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
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                className="w-full border border-[#F3CCDE] rounded-2xl px-4 py-3 pr-12 text-[#7B4364] focus:outline-none focus:ring-2 focus:ring-[#DDA9C5] bg-[#FFF8FC]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-3 text-[#BA88AE] hover:text-[#A96D98]"
              >

                {showPassword
                  ? "🙈"
                  : "👁"}

              </button>

            </div>

          </div>

          {/* ================= REMEMBER ================= */}
          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2 text-[#7B4364]">

              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="accent-[#BA88AE]"
              />

              Tetap Login

            </label>

            <Link
              href="/forgot-password"
              className="text-[#BA88AE] hover:text-[#A96D98] font-medium"
            >

              Lupa Password?

            </Link>

          </div>

          {/* ================= BUTTON ================= */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#BA88AE] hover:bg-[#A96D98] text-white py-3 rounded-2xl font-semibold text-lg transition shadow-md"
          >

            {loading
              ? "Loading..."
              : "Masuk"}

          </button>

          {/* ================= REGISTER ================= */}
          <div className="text-center pt-2">

            <p className="text-[#7B4364] text-sm">

              Belum punya akun?{" "}

              <Link
                href="/register"
                className="text-[#BA88AE] font-semibold hover:text-[#A96D98]"
              >

                Daftar Sekarang

              </Link>

            </p>

          </div>

        </form>

      </div>

    </div>
  );
}