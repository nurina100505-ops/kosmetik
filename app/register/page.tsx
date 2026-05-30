"use client";

import { useState } from "react";

export default function RegisterPage() {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    birthDate: "",
    phone: "",
    password: "",
    gender: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    // ================= VALIDASI =================
    if (
      !form.firstName ||
      !form.lastName ||
      !form.username ||
      !form.email ||
      !form.password
    ) {

      alert("Semua field wajib diisi!");
      return;

    }

    try {

      const res = await fetch(
        "/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name:
              form.firstName +
              " " +
              form.lastName,

            username:
              form.username,

            email:
              form.email,

            password:
              form.password,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        alert(
          data.error
        );

        return;

      }

      // ================= SAVE USER =================
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert(
        "Register berhasil 🎉"
      );

      window.location.href =
        "/";

    } catch (error) {

      alert(
        "Terjadi kesalahan server"
      );

    }
  };

  return (

    <div className="min-h-screen bg-[#FFF8FC] flex items-center justify-center px-4 py-10">

      {/* ================= CARD ================= */}
      <div className="w-full max-w-2xl bg-white border border-[#F3CCDE] rounded-[35px] shadow-xl overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-r from-[#F8D8E8] to-[#FCEEF5] px-6 md:px-10 py-10 text-center">

          <h1 className="text-2xl md:text-4xl font-bold text-[#BA88AE] whitespace-nowrap tracking-wide">

            MERY HOUSE GALERY

          </h1>

          <div className="w-28 h-1 bg-[#DDA9C5] mx-auto mt-4 rounded-full"></div>

          <p className="text-[#7B4364] mt-4 text-sm md:text-base">

            Buat akun untuk mulai belanja skincare & makeup favorit kamu ✨

          </p>

        </div>

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="px-6 md:px-10 py-8 space-y-5"
        >

          {/* ================= NAMA ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* NAMA DEPAN */}
            <div>

              <label className="text-[#7B4364] font-semibold text-sm">

                Nama Depan *

              </label>

              <input
                type="text"
                name="firstName"
                required
                onChange={handleChange}
                placeholder="Nama depan"
                className="w-full mt-2 border border-[#F3CCDE] rounded-2xl px-4 py-3 bg-[#FFF8FC] text-[#7B4364] focus:outline-none focus:ring-2 focus:ring-[#DDA9C5]"
              />

            </div>

            {/* NAMA BELAKANG */}
            <div>

              <label className="text-[#7B4364] font-semibold text-sm">

                Nama Belakang *

              </label>

              <input
                type="text"
                name="lastName"
                required
                onChange={handleChange}
                placeholder="Nama belakang"
                className="w-full mt-2 border border-[#F3CCDE] rounded-2xl px-4 py-3 bg-[#FFF8FC] text-[#7B4364] focus:outline-none focus:ring-2 focus:ring-[#DDA9C5]"
              />

            </div>

          </div>

          {/* ================= USERNAME ================= */}
          <div>

            <label className="text-[#7B4364] font-semibold text-sm">

              Username *

            </label>

            <input
              type="text"
              name="username"
              required
              onChange={handleChange}
              placeholder="Masukkan username"
              className="w-full mt-2 border border-[#F3CCDE] rounded-2xl px-4 py-3 bg-[#FFF8FC] text-[#7B4364] focus:outline-none focus:ring-2 focus:ring-[#DDA9C5]"
            />

          </div>

          {/* ================= EMAIL ================= */}
          <div>

            <label className="text-[#7B4364] font-semibold text-sm">

              Email *

            </label>

            <input
              type="email"
              name="email"
              required
              onChange={handleChange}
              placeholder="admin@gmail.com"
              className="w-full mt-2 border border-[#F3CCDE] rounded-2xl px-4 py-3 bg-[#FFF8FC] text-[#7B4364] focus:outline-none focus:ring-2 focus:ring-[#DDA9C5]"
            />

          </div>

          {/* ================= TANGGAL LAHIR ================= */}
          <div>

            <label className="text-[#7B4364] font-semibold text-sm">

              Tanggal Lahir *

            </label>

            <input
              type="date"
              name="birthDate"
              required
              onChange={handleChange}
              className="w-full mt-2 border border-[#F3CCDE] rounded-2xl px-4 py-3 bg-[#FFF8FC] text-[#7B4364] focus:outline-none focus:ring-2 focus:ring-[#DDA9C5]"
            />

          </div>

          {/* ================= NOMOR HP ================= */}
          <div>

            <label className="text-[#7B4364] font-semibold text-sm">

              Nomor Handphone *

            </label>

            <input
              type="tel"
              name="phone"
              required
              onChange={handleChange}
              placeholder="08xxxxxxxxxx"
              className="w-full mt-2 border border-[#F3CCDE] rounded-2xl px-4 py-3 bg-[#FFF8FC] text-[#7B4364] focus:outline-none focus:ring-2 focus:ring-[#DDA9C5]"
            />

          </div>

          {/* ================= PASSWORD ================= */}
          <div>

            <label className="text-[#7B4364] font-semibold text-sm">

              Password *

            </label>

            <input
              type="password"
              name="password"
              required
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full mt-2 border border-[#F3CCDE] rounded-2xl px-4 py-3 bg-[#FFF8FC] text-[#7B4364] focus:outline-none focus:ring-2 focus:ring-[#DDA9C5]"
            />

          </div>

          {/* ================= GENDER ================= */}
          <div>

            <label className="text-[#7B4364] font-semibold text-sm">

              Gender *

            </label>

            <div className="flex gap-8 mt-3">

              {/* FEMALE */}
              <label className="flex items-center gap-2 text-[#7B4364]">

                <input
                  type="radio"
                  name="gender"
                  value="female"
                  required
                  onChange={handleChange}
                  className="accent-[#BA88AE]"
                />

                Female

              </label>

              {/* MALE */}
              <label className="flex items-center gap-2 text-[#7B4364]">

                <input
                  type="radio"
                  name="gender"
                  value="male"
                  onChange={handleChange}
                  className="accent-[#BA88AE]"
                />

                Male

              </label>

            </div>

          </div>

          {/* ================= BUTTON ================= */}
          <button
            type="submit"
            className="w-full bg-[#BA88AE] hover:bg-[#A96D98] text-white py-3 rounded-2xl font-semibold text-lg transition shadow-md"
          >

            membuat akun

          </button>

        </form>

      </div>

    </div>
  );
}