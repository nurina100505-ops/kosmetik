"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  LayoutGrid,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  FileText,
  Plus,
  Trash2,
  Pencil,
  X,
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    href: "/pemilik/dashboard",
    icon: LayoutGrid,
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
    name: "Artikel Tutorial",
    href: "/pemilik/artikeltutorial",
    icon: FileText,
  },
];

export default function Page() {
  const pathname = usePathname();

  const [products, setProducts] =
    useState<any[]>([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editId, setEditId] =
    useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    stock: "",
    price: "",
    image: "",
    is_recommended: false,
  });

  const brands = [
    "Wardah",
    "Vaseline",
    "Pantene",
    "Maybelline",
    "Garnier",
    "Emina",
  ];

  const categories = [
    "Skincare",
    "Makeup",
    "Bodycare",
    "Haircare",
  ];

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "/api/products"
      );

      const data =
        await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // ================= HANDLE IMAGE =================
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

  // ================= HANDLE EDIT =================
  const handleEdit = (
    product: any
  ) => {
    setForm({
      name:
        product.name || "",
      description:
        product.description || "",
      brand:
        product.brands?.name ||
        "",
      category:
        product.categories
          ?.name || "",
      stock:
        product.stock || "",
      price:
        product.price || "",
      image:
        product.image || "",
      is_recommended:
        product.is_recommended ||
        false,
    });

    setEditId(product.id);

    setShowForm(true);
  };

  // ================= RESET =================
  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      brand: "",
      category: "",
      stock: "",
      price: "",
      image: "",
      is_recommended: false,
    });

    setEditId(null);

    setShowForm(false);
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit =
    async () => {
      try {
        const method =
          editId
            ? "PATCH"
            : "POST";

        const bodyData = {
          id: editId,
          name: form.name,
          description:
            form.description,
          price: form.price,
          stock: form.stock,
          image: form.image,
          category_name:
            form.category,
          brand_name:
            form.brand,
          is_recommended:
            form.is_recommended,
        };

        const res =
          await fetch(
            "/api/products",
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

        const data =
          await res.json();

        if (!res.ok) {
          alert(
            data.error ||
              "Gagal simpan produk"
          );

          return;
        }

        alert(
          editId
            ? "Produk berhasil diupdate"
            : "Produk berhasil ditambah"
        );

        resetForm();

        fetchProducts();
      } catch (error) {
        console.log(error);
      }
    };

  // ================= UPDATE STOCK =================
  const updateStock =
    async (
      id: number,
      stock: number
    ) => {
      if (stock < 0) return;

      try {
        await fetch(
          "/api/products",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id,
              stock,
            }),
          }
        );

        fetchProducts();
      } catch (error) {
        console.log(error);
      }
    };

  // ================= TOGGLE REKOMENDASI =================
  const toggleRecommended =
    async (
      id: number,
      value: boolean
    ) => {
      try {
        await fetch(
          "/api/products",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id,
              is_recommended:
                value,
            }),
          }
        );

        fetchProducts();
      } catch (error) {
        console.log(error);
      }
    };

  // ================= DELETE =================
  const deleteProduct =
    async (id: number) => {
      const confirmDelete =
        confirm(
          "Yakin ingin menghapus produk?"
        );

      if (!confirmDelete)
        return;

      try {
        await fetch(
          "/api/products",
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

        fetchProducts();
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div className="flex min-h-screen bg-[#FFF8FC]">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-20 bg-[#BA88AE] flex flex-col items-center py-5 gap-4 shadow-lg">

        {menus.map((item, i) => {
          const Icon = item.icon;

          const active =
            pathname ===
            item.href;

          return (
            <Link
              key={i}
              href={item.href}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                active
                  ? "bg-white text-[#BA88AE]"
                  : "text-white hover:bg-[#C998BE]"
              }`}
            >
              <Icon size={18} />
            </Link>
          );
        })}

      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between mb-7">

          <div>
            <h1 className="text-4xl font-bold text-[#BA88AE]">
              Kelola Produk
            </h1>

            <p className="text-[#7B4364] mt-2">
              Kelola seluruh produk
              toko Mery House
              Galery ✨
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
            className="flex items-center gap-2 bg-[#BA88AE] hover:bg-[#A96D98] text-white px-5 py-3 rounded-2xl shadow-md transition-all"
          >
            {showForm ? (
              <>
                <X size={16} />
                Batal
              </>
            ) : (
              <>
                <Plus size={16} />
                Tambah Produk
              </>
            )}
          </button>

        </div>

        {/* ================= FORM ================= */}
        {showForm && (
          <div className="bg-white border border-[#F3CCDE] rounded-[30px] p-7 shadow-sm mb-8">

            <h2 className="text-2xl font-bold text-[#BA88AE] mb-6">

              {editId
                ? "Edit Produk"
                : "Tambah Produk"}

            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <input
                type="text"
                name="name"
                placeholder="Nama Produk"
                value={form.name}
                onChange={handleChange}
                className="border border-[#F3CCDE] bg-[#FFF8FC] rounded-2xl px-4 py-3 outline-none text-[#7B4364]"
              />

              <input
                type="number"
                name="price"
                placeholder="Harga"
                value={form.price}
                onChange={handleChange}
                className="border border-[#F3CCDE] bg-[#FFF8FC] rounded-2xl px-4 py-3 outline-none text-[#7B4364]"
              />

              <input
                type="number"
                name="stock"
                placeholder="Stok"
                value={form.stock}
                onChange={handleChange}
                className="border border-[#F3CCDE] bg-[#FFF8FC] rounded-2xl px-4 py-3 outline-none text-[#7B4364]"
              />

              <select
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="border border-[#F3CCDE] bg-[#FFF8FC] rounded-2xl px-4 py-3 outline-none text-[#7B4364]"
              >
                <option value="">
                  Pilih Brand
                </option>

                {brands.map(
                  (b, i) => (
                    <option
                      key={i}
                      value={b}
                    >
                      {b}
                    </option>
                  )
                )}
              </select>

              <select
                name="category"
                value={
                  form.category
                }
                onChange={
                  handleChange
                }
                className="border border-[#F3CCDE] bg-[#FFF8FC] rounded-2xl px-4 py-3 outline-none text-[#7B4364]"
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

              <input
                type="file"
                onChange={
                  handleImage
                }
                className="border border-[#F3CCDE] bg-[#FFF8FC] rounded-2xl px-4 py-3 text-[#7B4364]"
              />

            </div>

            <textarea
              name="description"
              placeholder="Deskripsi Produk"
              value={
                form.description
              }
              onChange={
                handleChange
              }
              className="w-full mt-5 border border-[#F3CCDE] bg-[#FFF8FC] rounded-2xl px-4 py-3 min-h-[120px] outline-none text-[#7B4364]"
            />

            <label className="flex items-center gap-3 mt-5 text-[#7B4364]">

              <input
                type="checkbox"
                checked={
                  form.is_recommended
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_recommended:
                      e.target.checked,
                  })
                }
                className="accent-[#BA88AE]"
              />

              Jadikan Produk
              Rekomendasi

            </label>

            {form.image && (
              <img
                src={form.image}
                className="w-24 h-24 object-cover rounded-2xl mt-5 border border-[#F3CCDE]"
              />
            )}

            <div className="flex gap-3 mt-6">

              <button
                onClick={
                  handleSubmit
                }
                className="bg-[#BA88AE] hover:bg-[#A96D98] text-white px-6 py-3 rounded-2xl"
              >
                {editId
                  ? "Update Produk"
                  : "Simpan Produk"}
              </button>

              <button
                onClick={
                  resetForm
                }
                className="bg-[#F6DCE8] text-[#7B4364] px-6 py-3 rounded-2xl"
              >
                Batal
              </button>

            </div>

          </div>
        )}

        {/* ================= TABLE ================= */}
        <div className="bg-white border border-[#F3CCDE] rounded-[30px] overflow-hidden shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-[#FCEEF5] text-[#BA88AE] text-sm">

                  <th className="text-left px-6 py-5 font-semibold">
                    Produk
                  </th>

                  <th className="px-4 py-5 font-semibold">
                    Brand
                  </th>

                  <th className="px-4 py-5 font-semibold">
                    Kategori
                  </th>

                  <th className="px-4 py-5 font-semibold">
                    Harga
                  </th>

                  <th className="px-4 py-5 font-semibold">
                    Stok
                  </th>

                  <th className="px-4 py-5 font-semibold">
                    Rekomendasi
                  </th>

                  <th className="px-4 py-5 font-semibold">
                    Aksi
                  </th>

                </tr>

              </thead>

              <tbody>

                {products.map((p) => (

                  <tr
                    key={p.id}
                    className="border-t border-[#F8DDE8] hover:bg-[#FFF8FC] transition"
                  >

                    {/* PRODUK */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <img
                          src={
                            p.image ||
                            "/produk4.png"
                          }
                          className="w-16 h-16 object-cover rounded-2xl border border-[#F3CCDE]"
                        />

                        <div className="max-w-[280px]">

                          <p className="font-semibold text-[#7B4364] text-[15px]">
                            {p.name}
                          </p>

                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {
                              p.description
                            }
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* BRAND */}
                    <td className="text-center text-[#7B4364] font-medium">
                      {p.brands?.name}
                    </td>

                    {/* KATEGORI */}
                    <td className="text-center text-[#7B4364] font-medium">
                      {
                        p.categories
                          ?.name
                      }
                    </td>

                    {/* HARGA */}
                    <td className="text-center font-semibold text-[#BA88AE]">
                      Rp{" "}
                      {Number(
                        p.price
                      ).toLocaleString(
                        "id-ID"
                      )}
                    </td>

                    {/* STOK */}
                    <td>

                      <div className="flex items-center justify-center gap-3">

                        <button
                          onClick={() =>
                            updateStock(
                              p.id,
                              (p.stock ||
                                0) - 1
                            )
                          }
                          className="w-7 h-7 rounded-full bg-red-400 hover:bg-red-500 text-white text-sm"
                        >
                          -
                        </button>

                        <span className="text-[#7B4364] font-semibold min-w-[18px] text-center">
                          {p.stock || 0}
                        </span>

                        <button
                          onClick={() =>
                            updateStock(
                              p.id,
                              (p.stock ||
                                0) + 1
                            )
                          }
                          className="w-7 h-7 rounded-full bg-[#BA88AE] hover:bg-[#A96D98] text-white text-sm"
                        >
                          +
                        </button>

                      </div>

                    </td>

                    {/* REKOMENDASI */}
                    <td className="text-center">

                      <input
                        type="checkbox"
                        checked={
                          p.is_recommended ||
                          false
                        }
                        onChange={(e) =>
                          toggleRecommended(
                            p.id,
                            e.target
                              .checked
                          )
                        }
                        className="w-4 h-4 accent-[#BA88AE]"
                      />

                    </td>

                    {/* AKSI */}
                    <td>

                      <div className="flex items-center justify-center gap-2">

                        <button
                          onClick={() =>
                            handleEdit(
                              p
                            )
                          }
                          className="w-8 h-8 rounded-xl bg-[#BA88AE] hover:bg-[#A96D98] flex items-center justify-center text-white transition"
                        >
                          <Pencil
                            size={14}
                          />
                        </button>

                        <button
                          onClick={() =>
                            deleteProduct(
                              p.id
                            )
                          }
                          className="w-8 h-8 rounded-xl bg-red-400 hover:bg-red-500 flex items-center justify-center text-white transition"
                        >
                          <Trash2
                            size={14}
                          />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}