"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  FileText,
  Trash2,
  Plus,
  X,
  Pencil,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    href: "/pemilik/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Kelola Produk",
    href: "/pemilik/kelolaproduk",
    icon: Package,
  },
  {
    name: "Pesanan",
    href: "/pemilik/pesanan",
    icon: ShoppingCart,
  },
  {
    name: "Pelanggan",
    href: "/pemilik/pelanggan",
    icon: Users,
  },
  {
    name: "Laporan",
    href: "/pemilik/laporan",
    icon: BarChart3,
  },
  {
    name: "Artikel & Tutorial",
    href: "/pemilik/artikeltutorial",
    icon: FileText,
  },
];

export default function Page() {
  const pathname = usePathname();

  const [articles, setArticles] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [editId, setEditId] =
    useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
    category: "",
  });

  const categories = [
    "Skincare",
    "Makeup",
    "Bodycare",
    "Haircare",
  ];

  // ================= FETCH =================
  const fetchArticles = async () => {
    try {
      const res = await fetch(
        "/api/artikel"
      );

      const data =
        await res.json();

      if (Array.isArray(data)) {
        setArticles(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // ================= INPUT =================
  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // ================= IMAGE =================
  const handleImage = (e: any) => {
    const file =
      e.target.files[0];

    const reader =
      new FileReader();

    reader.onloadend = () => {
      setForm({
        ...form,
        image:
          reader.result as string,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // ================= RESET =================
  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      image: "",
      category: "",
    });

    setEditId(null);
    setShowForm(false);
  };

  // ================= EDIT =================
  const handleEdit = (
    item: any
  ) => {
    setForm({
      title: item.title || "",
      content:
        item.content || "",
      image: item.image || "",
      category:
        item.category || "",
    });

    setEditId(item.id);

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= SUBMIT =================
  const handleSubmit =
    async () => {
      try {
        const method =
          editId
            ? "PATCH"
            : "POST";

        const bodyData = {
          id: editId,
          title: form.title,
          content:
            form.content,
          image: form.image,
          category:
            form.category,
        };

        const res =
          await fetch(
            "/api/artikel",
            {
              method,
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify(
                bodyData
              ),
            }
          );

        if (!res.ok) {
          alert(
            "Gagal menyimpan artikel"
          );

          return;
        }

        alert(
          editId
            ? "Artikel berhasil diupdate"
            : "Artikel berhasil ditambahkan"
        );

        resetForm();

        fetchArticles();
      } catch (error) {
        console.log(error);
      }
    };

  // ================= DELETE =================
  const deleteArticle =
    async (id: number) => {
      const confirmDelete =
        confirm(
          "Yakin ingin menghapus artikel?"
        );

      if (!confirmDelete)
        return;

      try {
        await fetch(
          "/api/artikel",
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id,
            }),
          }
        );

        fetchArticles();
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div className="flex min-h-screen bg-[#FFF8FC]">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-20 bg-[#BA88AE] flex flex-col items-center py-5 gap-5 shadow-xl">

        {menu.map(
          (item, index) => {
            const Icon =
              item.icon;

            const isActive =
              pathname ===
              item.href;

            return (
              <Link
                key={index}
                href={item.href}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-white text-[#BA88AE] shadow-lg"
                    : "text-white hover:bg-[#C998BE]"
                }`}
              >
                <Icon size={18} />
              </Link>
            );
          }
        )}

      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold text-[#BA88AE]">
              Artikel & Tutorial
            </h1>

            <p className="text-[#7B4364] mt-1">
              Kelola artikel dan
              tutorial kecantikan
              Mery House Galery ✨
            </p>
          </div>

          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
            className="flex items-center gap-2 bg-[#BA88AE] hover:bg-[#A96D98] text-white px-5 py-3 rounded-2xl shadow-md transition"
          >
            {showForm ? (
              <>
                <X size={16} />
                Batal
              </>
            ) : (
              <>
                <Plus size={16} />
                Tambah Artikel
              </>
            )}
          </button>

        </div>

        {/* ================= FORM ================= */}
        {showForm && (
          <div className="bg-white border border-[#F3CCDE] rounded-[28px] p-6 shadow-md mb-8">

            <h2 className="text-2xl font-bold text-[#BA88AE] mb-6">

              {editId
                ? "Edit Artikel"
                : "Tambah Artikel Baru"}

            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* JUDUL */}
              <div>

                <label className="text-sm font-semibold text-[#7B4364]">

                  Judul Artikel

                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Masukkan judul artikel"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full mt-2 border border-[#F3CCDE] bg-[#FFF8FC] rounded-2xl px-4 py-3 text-[#7B4364] focus:outline-none"
                />

              </div>

              {/* KATEGORI */}
              <div>

                <label className="text-sm font-semibold text-[#7B4364]">

                  Kategori

                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full mt-2 border border-[#F3CCDE] bg-[#FFF8FC] rounded-2xl px-4 py-3 text-[#7B4364] focus:outline-none"
                >
                  <option value="">
                    Pilih Kategori
                  </option>

                  {categories.map(
                    (c, i) => (
                      <option
                        key={i}
                        value={c}
                      >
                        {c}
                      </option>
                    )
                  )}
                </select>

              </div>

            </div>

            {/* KONTEN */}
            <div className="mt-5">

              <label className="text-sm font-semibold text-[#7B4364]">

                Isi Artikel

              </label>

              <textarea
                name="content"
                placeholder="Masukkan isi artikel atau tutorial..."
                value={form.content}
                onChange={handleChange}
                className="w-full mt-2 border border-[#F3CCDE] bg-[#FFF8FC] rounded-2xl px-4 py-3 text-[#7B4364] min-h-[140px] focus:outline-none"
              />

            </div>

            {/* GAMBAR */}
            <div className="mt-5">

              <label className="text-sm font-semibold text-[#7B4364]">

                Upload Gambar

              </label>

              <input
                type="file"
                onChange={handleImage}
                className="w-full mt-2 border border-[#F3CCDE] bg-[#FFF8FC] rounded-2xl px-4 py-3 text-[#7B4364]"
              />

            </div>

            {/* PREVIEW */}
            {form.image && (
              <img
                src={form.image}
                className="w-28 h-28 object-cover rounded-2xl mt-5 border border-[#F3CCDE]"
              />
            )}

            {/* BUTTON */}
            <div className="flex gap-4 mt-6">

              <button
                onClick={
                  handleSubmit
                }
                className="bg-[#BA88AE] hover:bg-[#A96D98] text-white px-6 py-3 rounded-2xl shadow-md transition"
              >
                {editId
                  ? "Update Artikel"
                  : "Simpan Artikel"}
              </button>

              <button
                onClick={
                  resetForm
                }
                className="bg-[#F3CCDE] hover:bg-[#EABBD3] text-[#7B4364] px-6 py-3 rounded-2xl transition"
              >
                Batal
              </button>

            </div>

          </div>
        )}

        {/* ================= TABLE ================= */}
        <div className="bg-white border border-[#F3CCDE] rounded-[28px] shadow-md overflow-hidden">

          <div className="px-6 py-5 border-b border-[#F3CCDE] bg-[#FCEEF5]">

            <h2 className="text-xl font-bold text-[#BA88AE]">

              Daftar Artikel

            </h2>

            <p className="text-sm text-[#7B4364] mt-1">

              Semua artikel dan
              tutorial yang sudah
              dibuat

            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-[#FFF5FA] text-[#BA88AE] text-sm">

                  <th className="p-4 border-b border-[#F3CCDE] text-left">
                    Gambar
                  </th>

                  <th className="p-4 border-b border-[#F3CCDE] text-left">
                    Judul Artikel
                  </th>

                  <th className="p-4 border-b border-[#F3CCDE] text-center">
                    Kategori
                  </th>

                  <th className="p-4 border-b border-[#F3CCDE] text-center">
                    Tanggal
                  </th>

                  <th className="p-4 border-b border-[#F3CCDE] text-center">
                    Aksi
                  </th>

                </tr>

              </thead>

              <tbody>

                {articles.length >
                0 ? (
                  articles.map(
                    (item) => (
                      <tr
                        key={
                          item.id
                        }
                        className="border-b border-[#F8D9E7] hover:bg-[#FFF8FC] transition"
                      >

                        {/* GAMBAR */}
                        <td className="p-4">

                          <img
                            src={
                              item.image
                            }
                            className="w-16 h-16 object-cover rounded-2xl border border-[#F3CCDE]"
                          />

                        </td>

                        {/* JUDUL */}
                        <td className="p-4">

                          <div>

                            <p className="font-semibold text-[#7B4364]">

                              {
                                item.title
                              }

                            </p>

                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">

                              {
                                item.content
                              }

                            </p>

                          </div>

                        </td>

                        {/* KATEGORI */}
                        <td className="p-4 text-center">

                          <span className="bg-[#FCEEF5] text-[#BA88AE] px-3 py-1 rounded-full text-xs font-medium">

                            {
                              item.category
                            }

                          </span>

                        </td>

                        {/* TANGGAL */}
                        <td className="p-4 text-center text-[#7B4364] text-sm">

                          {new Date(
                            item.created_at
                          ).toLocaleDateString(
                            "id-ID"
                          )}

                        </td>

                        {/* AKSI */}
                        <td className="p-4">

                          <div className="flex items-center justify-center gap-2">

                            {/* EDIT */}
                            <button
                              onClick={() =>
                                handleEdit(
                                  item
                                )
                              }
                              className="bg-[#BA88AE] hover:bg-[#A96D98] text-white p-2 rounded-xl transition"
                            >
                              <Pencil
                                size={
                                  14
                                }
                              />
                            </button>

                            {/* DELETE */}
                            <button
                              onClick={() =>
                                deleteArticle(
                                  item.id
                                )
                              }
                              className="bg-red-400 hover:bg-red-500 text-white p-2 rounded-xl transition"
                            >
                              <Trash2
                                size={
                                  14
                                }
                              />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )
                ) : (
                  <tr>

                    <td
                      colSpan={5}
                      className="p-10 text-center text-[#7B4364]"
                    >
                      Belum ada
                      artikel
                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}